from datetime import datetime, timedelta, timezone
import io
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

# tokens and encryption
import bcrypt
import jwt

import google_drive_utils
from models import db, User, RefreshToken

from sqlalchemy.exc import ProgrammingError

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests

MEDIA_FOLDER_NAME = os.getenv("MEDIA_FOLDER_NAME")
METADATA_FOLDER_NAME = os.getenv("METADATA_FOLDER_NAME")

SECRET_KEY = os.getenv("SECRET_KEY")

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # imrove performance

db.init_app(app)

# to remove once we hit production (remember to switch to migrate)

with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")


def save_files_on_drive(title, description, platforms, video_file, user_email, user_folder_id):

    #UPLOAD TO MEDIA
    parent = user_folder_id
    folders = google_drive_utils.get_folders_in_parent(parent)

    name_to_id = google_drive_utils.folders_into_name_to_id(folders) # create name to id dictionary

    number_of_past_uploads = google_drive_utils.get_folder_length(name_to_id[MEDIA_FOLDER_NAME])
    current_upload_count = str(number_of_past_uploads + 1)

    new_media_folder_id = google_drive_utils.create_folder(current_upload_count, name_to_id[MEDIA_FOLDER_NAME])

    google_drive_utils.upload(video_file, "application/octet-stream", current_upload_count, new_media_folder_id)

    #UPLOAD TO METADATA
    data = {
        "title": title,
        "description": description,
        "platforms": platforms,
        "email": user_email # not really neccessary
    }
    json_data = json.dumps(data, indent=4)

    file_object = io.BytesIO(json_data.encode("utf-8"))

    google_drive_utils.upload(file_object, "application/json", current_upload_count, name_to_id[METADATA_FOLDER_NAME])


@app.route('/upload', methods=['POST'])
def upload_to_google_drive():
    try:
        auth_header = request.headers.get("Authorization") # Extract the authorization token
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1] # Basically ["Bearer", "<token>"][1] = "<token>"

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"]) # Decode the token
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        user_email = payload["email"]
        user_folder_id = payload["user_folder_id"]

        title = request.form.get("title")
        description = request.form.get("description")
        platforms = json.loads(request.form.get("platforms"))
        video_file = request.files.get("videoFile")

        if not title or not description or not platforms or not video_file or not isinstance(platforms, list):
            return jsonify({"message": "Missing required fields or platforms isnt a list"}), 400

        save_files_on_drive(title, description, platforms, video_file, user_email, user_folder_id) # later make sure files arent too big and have the proper format

        return jsonify({"message": "File uploaded successfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        email = request.form.get("email")
        password = request.form.get("password")

        if not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        print(email)
        print(password)

        user = User.query.filter_by(email=email).first()

        payload = {
            "id": user.id,
            "email": user.email,
            "user_folder_id": user.user_folder_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)  # Token expires in 1 hour
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        if not user:
            return jsonify({"message": "Invalid email or password"}), 400

        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({"message": "Invalid email or password"}), 400

        return jsonify({"message": "User logged in succesfully", "token": token}), 200
    except ProgrammingError as e:
        if "UndefinedColumn" in str(e):
            return jsonify({"message": "An account with this email does not exist, try signing up"}), 400
        return jsonify({"message": "A database error occured"}), 500
    except Exception as e:
        return jsonify({"message": "A server error occured"}), 500

@app.route('/signup', methods=['POST'])
def sign_up_user():
    try: # make sure to add encription to password
        email = request.form.get("email")
        password = request.form.get("password")
        user_folder_id = None

        if not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        print(email)
        print(password)


        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "Email already in use"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user_folder_id = google_drive_utils.create_folder(email)
        google_drive_utils.create_folder(MEDIA_FOLDER_NAME, user_folder_id)
        google_drive_utils.create_folder(METADATA_FOLDER_NAME, user_folder_id)

        new_user = User(email=email, user_folder_id=user_folder_id, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        payload = {
            "id": new_user.id,
            "email": email,
            "user_folder_id": user_folder_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)  # Token expires in 1 hour
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return jsonify({"message": "User signed up succesfully", "token": token}), 200
    except Exception as e:
        db.session.rollback()
        if user_folder_id:
            google_drive_utils.delete_file(user_folder_id) # delete user folder if it got created
        return jsonify({"message": f"{e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
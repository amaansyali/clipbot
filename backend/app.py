import io
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

import google_drive_utils
from models import db, User, RefreshToken

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests

MEDIA_FOLDER_ID = os.getenv("MEDIA_FOLDER_ID")
METADATA_FOLDER_ID = os.getenv("METADATA_FOLDER_ID")

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


def save_files_on_drive(title, description, platforms, video_file):

    #UPLOAD TO MEDIA
    parent = google_drive_utils.get_parent_folder_id() # this will be the folder of the user, where all of their uploads are stored
    folders = google_drive_utils.get_folders_in_parent(parent)

    name_to_id = google_drive_utils.folders_into_name_to_id(folders)

    number_of_past_uploads = google_drive_utils.get_folder_length(name_to_id[MEDIA_FOLDER_ID])
    current_upload_count = str(number_of_past_uploads + 1)

    new_media_folder_id = google_drive_utils.create_folder(current_upload_count, name_to_id[MEDIA_FOLDER_ID])

    google_drive_utils.upload(video_file, "application/octet-stream", current_upload_count, new_media_folder_id)

    #UPLOAD TO METADATA
    data = {
        "title": title,
        "description": description,
        "platforms": platforms
    }
    json_data = json.dumps(data, indent=4)

    file_object = io.BytesIO(json_data.encode("utf-8"))

    google_drive_utils.upload(file_object, "application/json", current_upload_count, name_to_id[METADATA_FOLDER_ID])


@app.route('/upload', methods=['POST'])
def upload_to_google_drive():
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        platforms = json.loads(request.form.get("platforms"))
        video_file = request.files.get("videoFile")

        if not title or not description or not platforms or not video_file or not isinstance(platforms, list):
            return jsonify({"message": "Missing required fields or platforms isnt a list"}), 400

        save_files_on_drive(title, description, platforms, video_file) # later make sure files arent too big and have the proper format

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

        if not user:
            return jsonify({"message": "Invalid email or password"}), 400

        if not password == user.password:
            return jsonify({"message": "Invalid email or password"}), 400

        return jsonify({"message": "User logged in succesfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

@app.route('/signup', methods=['POST'])
def sign_up_user():
    try: # make sure to add encription to password
        email = request.form.get("email")
        password = request.form.get("password")

        if not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        print(email)
        print(password)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "Email already in use"}), 400

        new_user = User(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User signed up succesfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
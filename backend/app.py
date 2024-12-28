import io
import json
import os
from datetime import datetime, timedelta, timezone

from flask import Flask, redirect, request, jsonify, session
from flask_cors import CORS
import bcrypt
import jwt
from sqlalchemy.exc import ProgrammingError

import google_drive_utils
from models import db, User, Channel

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests


MEDIA_FOLDER_NAME = os.getenv("MEDIA_FOLDER_NAME")
METADATA_FOLDER_NAME = os.getenv("METADATA_FOLDER_NAME")

SECRET_KEY = os.getenv("SECRET_KEY")

app.secret_key = SECRET_KEY

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # imrove performance

db.init_app(app)

# to remove once we hit production (remember to switch to migrate)
with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")

def upload():
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

        google_drive_utils.save_files_on_drive(title, description, platforms, video_file, user_email, user_folder_id) # later make sure files arent too big and have the proper format

        return jsonify({"message": "File uploaded successfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

@app.route("/login", methods=["POST"])
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

        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"message": "Invalid email or password"}), 400

        payload = {
            "id": user.id,
            "email": user.email,
            "user_folder_id": user.user_folder_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)  # Token expires in 1 hour
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return jsonify({"message": "User logged in succesfully", "token": token}), 200
    except ProgrammingError as e:
        return jsonify({"message": "A database error occured"}), 500
    except Exception as e:
        return jsonify({"message": "A server error occured"}), 500

@app.route("/signup", methods=["POST"])
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

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

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
    except ProgrammingError as e:
        return jsonify({"message": "A database error occured"}), 500
    except Exception as e:
        return jsonify({"message": "A server error occured"}), 500


os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # REMOVE THIS !!!!! THIS ALLOWS OAUTH@ TO USE HTTP

CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
REDIRECT_URI = "http://localhost:5000/auth/youtube/callback"


flow = Flow.from_client_config(
    {
        "web": {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    },
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI,
)


@app.route("/auth/youtube/login")
def youtube_login():


    token = request.cookies.get("token")
    if not token:
        return "Missing token", 401
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["id"]
        user_email = payload["email"]
        print(user_id)
        print(user_email)
        print("IVE DONE ITTTT")
    except (e):
        print(e)


    authorization_url, state = flow.authorization_url(
        access_type="offline",  # Request a refresh token
        include_granted_scopes="true"  # Use previously granted scopes
    )
    session["state"] = state  # Store the state token in the session
    return redirect(authorization_url)

@app.route("/auth/youtube/callback")
def youtube_callback():

    if "state" not in session or session["state"] != request.args.get("state"):
        return "State mismatch", 400
    try:
        print("WE MADE ITTTT")

        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        access_token = credentials.token
        refresh_token = credentials.refresh_token

        youtube = build("youtube", "v3", credentials=credentials)
        response = youtube.channels().list(part="snippet", mine=True).execute()

        print(access_token)
        print(refresh_token)
        print(response)

        return redirect("http://localhost:5173/#/addchannel/success")
    except Exception as e:
        print(f"Error during token exchange: {e}")
        return redirect("http://localhost:5173/#/addchannel/error")


if __name__ == "__main__":
    app.run(debug=True)
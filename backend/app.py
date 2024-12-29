import io
import json
import os
from datetime import datetime, timedelta, timezone

from flask import Flask, make_response, redirect, request, jsonify, session
from flask_cors import CORS
import bcrypt
import jwt
from sqlalchemy.exc import ProgrammingError

import google_drive_utils
from models import db, User, Channel

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests

MEDIA_FOLDER_NAME = os.getenv("MEDIA_FOLDER_NAME")
METADATA_FOLDER_NAME = os.getenv("METADATA_FOLDER_NAME")

TOKEN_EXPIRED = "TOKEN_EXPIRED"
TOKEN_INVALID = "TOKEN_INVALID"

SECRET_KEY = os.getenv("SECRET_KEY")

app.secret_key = SECRET_KEY

#DATABASE
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

# ACCESS AND REFRESH TOKENS
ACCESS_TOKEN_EXPIRES_MINUTES = 15
REFRESH_TOKEN_EXPIRES_DAYS = 7

def create_access_token(user_id, user_folder_id):
    return jwt.encode(
        {"id": user_id, "user_folder_id": user_folder_id, "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)},
        app.secret_key,
        algorithm="HS256"
    )

def create_refresh_token(user_id, user_folder_id):
    return jwt.encode(
        {"id": user_id, "user_folder_id": user_folder_id, "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)},
        app.secret_key,
        algorithm="HS256"
    )

def generate_access_and_refresh_response(user_id, user_folder_id):
    access_token = create_access_token(user_id, user_folder_id)
    refresh_token = create_refresh_token(user_id, user_folder_id)

    response = make_response(jsonify({"message": "Logged in successfully"}))
    response.set_cookie('access_token', access_token, httponly=True, secure=False, samesite='Strict', path='/') # secure = true in production
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=False, samesite='Strict', path='/') # secure = true in production

    return response

@app.route('/auth/validate', methods=['POST'])
def validate_token():

    access_token = request.cookies.get('access_token')
    print(access_token)

    if not access_token:
        return jsonify({"isValid": False}), 401
    try:
        decoded = jwt.decode(access_token, app.secret_key, algorithms=["HS256"])
        return jsonify({"isValid": True, "user_id": decoded["id"]}), 200
    except jwt.ExpiredSignatureError:
        print("Access token expired")
        return jsonify({"isValid": False, "message": "Access token expired", "error_message": TOKEN_EXPIRED}), 401
    except jwt.InvalidTokenError:
        print("Invalid token")
        return jsonify({"isValid": False, "message": "Invalid token", "error_message": TOKEN_INVALID}), 401

@app.route('/auth/refresh', methods=['POST'])
def refresh_token():
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        return jsonify({"message": "Missing refresh token"}), 401

    try:
        decoded = jwt.decode(refresh_token, app.secret_key, algorithms=["HS256"])
        user_id = decoded["id"]
        user_folder_id = decoded['user_folder_id']

        # Generate a new access token
        new_access_token = create_access_token(user_id, user_folder_id)

        response = make_response(jsonify({"message": "Access token refreshed"}))
        response.set_cookie('access_token', new_access_token, httponly=True, secure=False, samesite='Strict', path='/') # secure = true in production

        return response
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Refresh token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid refresh token"}), 401


@app.route('/upload', methods=['POST'])
def upload():

    access_token = request.cookies.get('access_token')

    if not access_token:
        return jsonify({"message": "Missing access token"}), 401

    try:
        decoded = jwt.decode(access_token, app.secret_key, algorithms=["HS256"])

        user_folder_id = decoded['user_folder_id']

        title = request.form.get("title")
        description = request.form.get("description")
        platforms = json.loads(request.form.get("platforms"))
        video_file = request.files.get("videoFile")

        if not title or not description or not platforms or not video_file or not isinstance(platforms, list):
            return jsonify({"message": "Missing required fields or platforms isnt a list"}), 400

        google_drive_utils.save_files_on_drive(title, description, platforms, video_file, user_folder_id) # later make sure files arent too big and have the proper format

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

        return generate_access_and_refresh_response(user.id, user.user_folder_id) # 200 response

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

        return generate_access_and_refresh_response(new_user.id, new_user.user_folder_id)

    except ProgrammingError as e:
        return jsonify({"message": "A database error occured"}), 500
    except Exception as e:
        return jsonify({"message": "A server error occured"}), 500

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

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

    access_token = request.cookies.get('access_token')
    if not access_token:
        return "Missing acess token", 401

    try:
        decoded = jwt.decode(access_token, app.secret_key, algorithms=["HS256"])

        user_id = decoded["id"]
        print(user_id)

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
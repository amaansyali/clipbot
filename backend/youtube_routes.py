from flask import Blueprint, redirect, request, session, jsonify
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from models import db, User, Channel
import os
import jwt

# Constants
CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
REDIRECT_URI = "http://localhost:5000/auth/youtube/callback"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # THIS ALLOWS OAUTH TO USE HTTP AND NOT REQUIRE HTTPS

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

youtube_blueprint = Blueprint("youtube", __name__)

@youtube_blueprint.route("/auth/youtube/login")
def youtube_login():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return "Missing access token", 401

    try:
        decoded = jwt.decode(access_token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = decoded["id"]
    except Exception as e:
        print(e)
        return "Invalid token", 401

    authorization_url, state = flow.authorization_url(
        access_type="offline", include_granted_scopes="true", prompt="consent"
    )
    session["state"] = state
    session["id"] = user_id
    return redirect(authorization_url)

# YouTube Callback Route
@youtube_blueprint.route("/auth/youtube/callback")
def youtube_callback():
    if "state" not in session or session["state"] != request.args.get("state"):
        return "State mismatch", 400

    try:
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        yt_access_token = credentials.token
        yt_refresh_token = credentials.refresh_token

        youtube = build("youtube", "v3", credentials=credentials)
        response = youtube.channels().list(part="snippet", mine=True).execute()

        if "items" in response and len(response["items"]) > 0:
            channel = response["items"][0]
            channel_name = channel["snippet"]["title"]
            channel_id = channel["id"]

            user_id = session["id"]
            if not user_id:
                return "User not logged in", 401

            user = User.query.filter_by(id=user_id).first()
            if not user:
                return "User not found", 404

            new_channel = Channel(
                user_id=user_id,
                platform="youtube",
                access_token=yt_access_token,
                refresh_token=yt_refresh_token,
                channel_name=channel_name,
                channel_id=channel_id,
            )
            db.session.add(new_channel)
            db.session.commit()

        return redirect("http://localhost:5173/#/addchannel/success")
    except Exception as e:
        print(f"Error during token exchange: {e}")
        return redirect("http://localhost:5173/#/addchannel/error")

import os
from dotenv import load_dotenv

from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.discovery import build
from google.oauth2 import service_account

import io

#load the service account
load_dotenv()

SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS")
if not SERVICE_ACCOUNT_FILE:
    raise ValueError("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS error")

#load parent folder id
PARENT_FOLDER_ID = os.getenv("PARENT_FOLDER_ID")
if not PARENT_FOLDER_ID:
    raise ValueError("PARENT_FOLDER_ID error")

SCOPES = ["https://www.googleapis.com/auth/drive"]

def authenticate():
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return creds

def upload(file_object):
    creds = authenticate()

    service = build("drive", "v3", credentials=creds)

    file_metadata = {
        "name": "TEST FILE",
        "parents": [PARENT_FOLDER_ID]
    }

    media = MediaIoBaseUpload(file_object, mimetype="application/octet-stream", resumable=True)

    file = service.files().create(
        body = file_metadata,
        media_body = media
    ).execute()
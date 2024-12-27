import os

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from googleapiclient.errors import HttpError

#load the service account
load_dotenv()

SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS")
if not SERVICE_ACCOUNT_FILE:
    raise ValueError("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS error")

#load parent folder id
PARENT_FOLDER_ID = os.getenv("PARENT_FOLDER_ID") # clipbot folder id
if not PARENT_FOLDER_ID:
    raise ValueError("PARENT_FOLDER_ID error")

SCOPES = ["https://www.googleapis.com/auth/drive"]

def authenticate():
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return creds

def get_service():
    creds = authenticate()
    return build("drive", "v3", credentials=creds)

def get_parent_folder_id():
    return PARENT_FOLDER_ID

def upload(file_object, mime_type, filename, parent=PARENT_FOLDER_ID):

    try:
        service = get_service()

        file_metadata = {
            "name": filename,
            "parents": [parent]
        }
        media = MediaIoBaseUpload(file_object, mimetype=mime_type, resumable=True)

        file = service.files().create(
            body = file_metadata,
            media_body = media
        ).execute()

    except HttpError as error:
        print(f"An error occurred: {error}")
        files = None

def get_folder_length(folder_id):

    try:
        service = get_service()

        count = 0
        page_token = None
        while True:
            query = f"'{folder_id}' in parents and trashed=false"

            response = (
                service.files()
                .list(
                    q=query,
                    spaces="drive",
                    fields="nextPageToken, files(id, mimeType, size)",
                    pageToken=page_token,
                )
                .execute()
            )

            items = response.get("files", [])
            count += len(items)

            page_token = response.get("nextPageToken", None)
            if page_token is None:
                break

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return -1

    return count

def get_folders_in_parent(parent, folder_name=None):

    try:
        service = get_service()

        folders = []
        page_token = None
        while True:
            query = f"mimeType='application/vnd.google-apps.folder' and trashed=false and '{parent}' in parents"
            if folder_name:
                query += f" and name='{folder_name}'" # allow to specifically search for a folder

            response = (
                service.files()
                .list(
                    q=query,
                    spaces="drive",
                    fields="nextPageToken, files(id, name, parents)",
                    pageToken=page_token,
                )
                .execute()
            )

            for file in response.get("files", []):
                print(f"Folder: {file.get('name')}, ID: {file.get('id')}, Parent: {file.get('parents')}")
                folders.append(file)

            # pagination n dat
            page_token = response.get("nextPageToken", None)
            if page_token is None:
                break

    except HttpError as error:
        print(f"An error occurred: {error}")
        folders = None

    return folders

def folders_into_name_to_id(folders):
    name_to_id_dict = {}

    for folder in folders:
        name_to_id_dict[folder["name"]] = folder["id"]

    return name_to_id_dict

def create_folder(folder_name, parent_folder_id=PARENT_FOLDER_ID):
    try:
        creds = authenticate()
        service = build("drive", "v3", credentials=creds)

        folder_metadata = {
            "name": folder_name,
            "mimeType": "application/vnd.google-apps.folder"
        }
        if parent_folder_id:
            folder_metadata["parents"] = [parent_folder_id]

        folder = service.files().create(
            body=folder_metadata,
            fields="id"
        ).execute()

        print(f"Folder '{folder_name}' created successfully with ID: {folder.get('id')}")
        return folder.get("id")

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def delete_file(file_id):
    try:
        service = get_service()

        # Perform the delete operation
        service.files().delete(fileId=file_id).execute()
        print(f"File with ID {file_id} successfully deleted.")

    except Exception as e:
        print(f"An error occurred: {e}")

def delete_everything():
    # DOOMSDAY FUNCTION
    try:
        service = get_service()

        results = service.files().list(pageSize=1000, fields="files(id, name)").execute()
        files = results.get('files', [])

        if not files:
            print("No files found.")
            return

        for file in files:
            file_id = file['id']
            file_name = file['name']
            print(f"Deleting {file_name} (ID: {file_id})")
            service.files().delete(fileId=file_id).execute()

        print("All files deleted successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # delete_everything()
    pass
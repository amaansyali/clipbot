import io
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

import google_drive_utils

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests

MEDIA_FOLDER_ID = os.getenv("MEDIA_FOLDER_ID")
METADATA_FOLDER_ID = os.getenv("METADATA_FOLDER_ID")

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
        post = {
            "title": request.form.get("title"),
            "description": request.form.get("description"),
            "platforms": json.loads(request.form.get("platforms")),
            "video_file": request.files.get("videoFile"),
        }

        if not post["title"] or not post["description"] or not post["platforms"] or not post["video_file"] or not isinstance(post["platforms"], list):
            return jsonify({"message": "Missing required fields or platforms isnt a list"}), 400

        save_files_on_drive(**post) # later make sure files arent too big and have the proper format

        return jsonify({"message": "File uploaded successfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
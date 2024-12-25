from flask import Flask, request, jsonify
from flask_cors import CORS

import google_drive_utils

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}}) #ensures only the frontend can make Cross Origin requests

@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        platforms = request.form.get("platforms")
        video_file = request.files.get("videoFile")

        if not title or not description or not platforms or not video_file:
            return jsonify({"message": "Missing required fields"}), 400

        google_drive_utils.upload(video_file)

        return jsonify({"message": "File uploaded successfully"}), 200
    except:
        return jsonify({"message": "Server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
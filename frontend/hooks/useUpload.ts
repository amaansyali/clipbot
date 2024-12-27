import { useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface Post {
    title: string;
    description: string;
    videoFile: File;
    platforms: string[];
    token: string | null;
}

const useUpload = () => {

    const [uploadError, setUploadError] = useState< string | null>(null);
    const [isLoading, setLoading] = useState(false)

    const uploadPost = async (postData: Post) => {

        try {
            const formData = new FormData();
            formData.append("title", postData.title)
            formData.append("description", postData.description)
            formData.append("videoFile", postData.videoFile)
            formData.append("platforms", JSON.stringify(postData.platforms))

            const token = postData.token

            setLoading(true)
            await apiClient.post("/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Bearer indicates the type of token being used
                    "Content-Type": "multipart/form-data"
                }
            });

        } catch (err: any) {
            if (err instanceof CanceledError) return;
            console.log(err)
            setUploadError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { uploadPost, isLoading, uploadError };
}

export default useUpload
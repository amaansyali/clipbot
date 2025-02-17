import { useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface Post {
    title: string;
    description: string;
    videoFile: File;
    platforms: string[];
}

const useUpload = () => {

    const [uploadError, setUploadError] = useState< string | null>(null);
    const [isUploadLoading, setLoading] = useState(false)

    const uploadPost = async (postData: Post) => {

        try {
            const formData = new FormData();
            formData.append("title", postData.title)
            formData.append("description", postData.description)
            formData.append("videoFile", postData.videoFile)
            formData.append("platforms", JSON.stringify(postData.platforms))

            setLoading(true)
            const response = await apiClient.post("/upload", formData, {});
            console.log(response)

        } catch (err: any) {
            if (err instanceof CanceledError) return;
            console.log(err)
            setUploadError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { uploadPost, isUploadLoading, uploadError };
}

export default useUpload
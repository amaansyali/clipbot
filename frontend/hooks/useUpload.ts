import { useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface Post {
    title: string;
    description: string;
    videoFile: File;
    youtubeSelectedChannels: string[],
    linkedinSelectedChannels: string[] | [],
    instagramSelectedChannels: string[],
    tiktokSelectedChannels: string[],
    otherSelectedChannels: string[],
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
            formData.append("youtubeSelectedChannels", JSON.stringify(postData.youtubeSelectedChannels))
            formData.append("linkedinSelectedChannels", JSON.stringify(postData.linkedinSelectedChannels))
            formData.append("instagramSelectedChannels", JSON.stringify(postData.instagramSelectedChannels))
            formData.append("tiktokSelectedChannels", JSON.stringify(postData.tiktokSelectedChannels))
            formData.append("otherSelectedChannels", JSON.stringify(postData.otherSelectedChannels))

            setLoading(true)
            const response = await apiClient.post("/upload", formData, {});
            console.log(response)

        } catch (err: any) {
            if (err instanceof CanceledError) return;
            console.log(err)
            setUploadError(err.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return { uploadPost, isUploadLoading, uploadError };
}

export default useUpload
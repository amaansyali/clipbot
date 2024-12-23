import { useState } from 'react';

import VideoUpload from "../VideoUpload";


const ContentUploadForm = () => {

    const [videoFile, setVideoFile] = useState< File | null >(null)

    const handleFileUpload = (file : File | null) => {
        setVideoFile(file)
    }

    return (

        <VideoUpload onFileUpload={handleFileUpload}/>

    )
};

export default ContentUploadForm;

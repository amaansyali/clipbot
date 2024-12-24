import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

interface Props {
    onFileUpload: (file: File | null) => void;
    isVideoMissing: boolean;
}

let currentFilename = "";

const VideoUpload = ({ onFileUpload, isVideoMissing }: Props) => {
    const [videoInputted, setVideoInputted] = useState(false);

    const [dragActive, setDragActive] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleRemove = () => {
        setDragActive(false);
        setVideoInputted(false);

        onFileUpload(null);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            setVideoInputted(true);
            currentFilename = file.name;
            onFileUpload(file);
        });
    }, []);

    const { fileRejections, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "video/*": [],
        },
    });

    const fileRejectionMessage = fileRejections.map(
        ({ errors }) => errors[0].message
    );

    return (
        <>
            <div className="max-w-md mx-auto mt-10">
                <div
                    {...getRootProps()}
                    className={`col-span-full ${
                        dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                    } mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {!videoInputted ? (
                        <>
                            <input type="file" {...getInputProps()} />

                            <div className="text-center">
                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-semibold text-primary-main focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-primary-hover"
                                    >
                                        <span>Upload a file</span>
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs/5 text-medium-dark">
                                    MP4, MOV, AVI
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-medium-dark">{currentFilename}</p>
                            <div className="text-sm/6 text-medium-dark">
                                <label className="relative cursor-pointer rounded-md font-semibold text-primary-main focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-primary-hover">
                                    <span>Remove File</span>
                                    <input
                                        className="sr-only"
                                        onClick={handleRemove}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {fileRejectionMessage && (
                    <div
                        className="pt-2 mb-4 text-sm text-red-dark rounded-lg dark:text-red-light"
                        role="alert"
                    >
                        {fileRejectionMessage}
                        {isVideoMissing && "Post field cannot be empty"}
                    </div>
                )}
            </div>
        </>
    );
};

export default VideoUpload;

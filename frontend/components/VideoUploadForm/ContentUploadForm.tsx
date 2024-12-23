import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import VideoUpload from "../VideoUpload";

const schema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty" }),
    description: z.string().max(2200, {
        message: "Description cannot be more than 2,200 characters",
    }),
});

type FormData = z.infer<typeof schema>;

let isVideoMissing = false;

const ContentUploadForm = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleFileUpload = (file: File | null) => {
        setVideoFile(file);
    };

    const onSubmit = (data: FormData) => {
        if (!videoFile) {
            isVideoMissing = true;
        } else {
            reset();
            isVideoMissing = false;

            // post object : { ...data, videoFile }
        }
    };

    // The Content Upload Form

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    return (
        <>
            <VideoUpload
                onFileUpload={handleFileUpload}
                isVideoMissing={isVideoMissing}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Title */}
                <div className="mb-4 sm:col-span-4">
                    <label
                        htmlFor="title"
                        className="block text-sm/6 font-medium text-gray-900"
                    >
                        Title
                    </label>
                    <div className="mt-2">
                        <input
                            {...register("title")}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    {errors.title && (
                        <div
                            className="pt-2 mb-4 text-sm text-red-800 rounded-lg dark:text-red-400"
                            role="alert"
                        >
                            {errors.title.message}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="col-span-full">
                    <label
                        htmlFor="description"
                        className="block text-sm/6 font-medium text-gray-900"
                    >
                        Video Description
                    </label>
                    <div className="mt-2">
                        <textarea
                            {...register("description")}
                            rows={3}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            defaultValue={""}
                        />
                    </div>
                    {errors.description && (
                        <div
                            className="pt-2 mb-4 text-sm text-red-800 rounded-lg dark:text-red-400"
                            role="alert"
                        >
                            {errors.description.message}
                        </div>
                    )}
                </div>

                {/* Cancel Save */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className="text-sm/6 font-semibold text-gray-900"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Post
                    </button>
                </div>
            </form>
        </>
    );
};

export default ContentUploadForm;

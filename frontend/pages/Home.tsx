import React from "react";

import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem";
import VideoUploadForm from "../components/VideoUploadForm";
import { NewPostIcon, AddChannelsIcon } from "../src/Icons";
import NavBar from "../components/NavBar";

// TEMPORARY HOME PAGE
export function Home() {
    return (
        <>
            <div className="flex h-screen">
                <aside className="hidden md:flex md:w-sidebar bg-gray-100 h-full">
                    <SideBar>
                        <SideBarItem
                            icon={<NewPostIcon />}
                            active={true}
                            href="/#/post"
                        >
                            New Post
                        </SideBarItem>
                        <SideBarItem
                            icon={<AddChannelsIcon />}
                            active={false}
                            href="/#/addchannels"
                        >
                            Add Channels
                        </SideBarItem>
                    </SideBar>
                </aside>

                <div className="flex-1 flex flex-col">
                    <NavBar />

                    <main className="flex-1 bg-white p-4">
                        <VideoUploadForm />
                    </main>
                </div>
            </div>
        </>
    );
}

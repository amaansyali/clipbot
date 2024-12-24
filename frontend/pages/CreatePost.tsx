import { useState } from "react";
import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem";
import VideoUploadForm from "../components/VideoUploadForm";
import { NewPostIcon, AddChannelsIcon } from "../src/Icons";
import NavBar from "../components/NavBar";
import { ROUTES } from "../src/routes";

export function CreatePost() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleChangeSideBar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="flex h-screen">
                <aside
                    className={`h-full bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out ${
                        isSidebarOpen
                            ? "translate-x-0 absolute md:relative md:translate-x-0"
                            : "-translate-x-full absolute md:relative md:translate-x-0"
                    }`}
                >
                    <SideBar
                        onChangeSideBar={handleChangeSideBar}
                        isSidebarOpen={isSidebarOpen}
                    >
                        <SideBarItem
                            icon={<NewPostIcon />}
                            active={true}
                            href={ROUTES.NEW_POST}
                        >
                            New Post
                        </SideBarItem>
                        <SideBarItem
                            icon={<AddChannelsIcon />}
                            active={false}
                            href={ROUTES.ADD_CHANNELS}
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



            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-dark bg-opacity-80 z-10 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </>
    );
}

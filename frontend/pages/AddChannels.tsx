import React, { useState } from "react";

import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem";
import NavBar from "../components/NavBar";

import { NewPostIcon, AddChannelsIcon } from "../src/Icons";
import { ROUTES } from "../../shared/routes";
import apiClient from "../services/api-client";

interface ConnectedAccounts {
    youtube: string[];
    linkedin: string[];
    instagram: string[];
    tiktok: string[];
}

export function AddChannels() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // Dumy data for appearance
    const connectedAccounts: ConnectedAccounts = {
        youtube: ["My YouTube Channel 1", "My YouTube Channel 2"],
        linkedin: ["My LinkedIn Profile"],
        instagram: ["My Instagram Account"],
        tiktok: ["My TikTok Account 1", "My TikTok Account 2"],
    };

    const handleChangeSideBar = (): void => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderConnectedAccounts = (
        platform: keyof ConnectedAccounts
    ): JSX.Element => {
        const accounts = connectedAccounts[platform] || [];
        return (
            <div className="mt-4 space-y-2">
                {accounts.map((account, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-lighter p-3 rounded-lg shadow-sm"
                    >
                        <span className="text-dark font-medium">{account}</span>
                        <button
                            className="text-red-light font-semibold hover:text-red-dark transition"
                            onClick={() =>
                                handleDisconnectAccount(platform, account)
                            }
                        >
                            Disconnect
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleAddYoutube = async () => {
        document.cookie = `token=${localStorage.getItem("authToken")}; Path=/`;
        window.location.href = "http://localhost:5000/auth/youtube/login";

    };

    const handleDisconnectAccount = (
        platform: keyof ConnectedAccounts,
        account: string
    ): void => {
        console.log(`Disconnecting ${account} from ${platform}`);
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
                            active={false}
                            href={ROUTES.NEW_POST}
                        >
                            New Post
                        </SideBarItem>
                        <SideBarItem
                            icon={<AddChannelsIcon />}
                            active={true}
                            href={ROUTES.ADD_CHANNELS}
                        >
                            Add Channels
                        </SideBarItem>
                    </SideBar>
                </aside>

                <div className="flex-1 flex flex-col">
                    <NavBar />

                    <main className="flex-1 bg-white">
                        <header className="bg-white">
                            <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8">
                                <h1 className="text-3xl font-bold tracking-tight text-dark">
                                    Add Channels
                                </h1>
                            </div>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-8xl px-4 sm:px-6 lg:px-8">
                            <div>
                                <button
                                    className="flex items-center justify-center w-full bg-red-600 font-semibold text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                                    onClick={handleAddYoutube}
                                >
                                    <img
                                        src="../src/assets/youtube_logo.png"
                                        alt="YouTube"
                                        className="w-6 h-4 mr-2"
                                    />
                                    Add YouTube
                                </button>
                                {renderConnectedAccounts("youtube")}
                            </div>

                            <div>
                                <button className="flex items-center justify-center w-full bg-blue-600 font-semibold text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                                    <img
                                        src="../src/assets/linkedin_logo.png"
                                        alt="LinkedIn"
                                        className="w-6 h-6 mr-2"
                                    />
                                    Add LinkedIn
                                </button>
                                {renderConnectedAccounts("linkedin")}
                            </div>

                            <div>
                                <button className="flex items-center justify-center w-full bg-pink-500 font-semibold text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition duration-200">
                                    <img
                                        src="../src/assets/instagram_logo.png"
                                        alt="Instagram"
                                        className="w-6 h-6 mr-2"
                                    />
                                    Add Instagram
                                </button>
                                {renderConnectedAccounts("instagram")}
                            </div>

                            <div>
                                <button className="flex items-center justify-center w-full bg-black font-semibold text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-200">
                                    <img
                                        src="../src/assets/tiktok_logo.png"
                                        alt="TikTok"
                                        className="w-6 h-6 mr-2"
                                    />
                                    Add TikTok
                                </button>
                                {renderConnectedAccounts("tiktok")}
                            </div>
                        </div>
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

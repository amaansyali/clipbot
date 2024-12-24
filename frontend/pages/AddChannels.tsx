import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem";
import { NewPostIcon, AddChannelsIcon } from "../src/Icons";

import { ROUTES } from "../src/routes"

import NavBar from "../components/NavBar";

export function AddChannels() {
    return (
        <>
            <div className="flex h-screen">
                <aside className="hidden md:flex md:w-sidebar bg-gray-100 h-full">
                    <SideBar>
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

                    <main className="flex-1 bg-white p-4">Add Channels</main>
                </div>
            </div>
        </>
    );
}

import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem/SideBarItem";
import ContentUploadForm from "../components/VideoUploadForm";
import { NewPostIcon, AddChannelsIcon } from "./Icons";

function App() {
    return (
        <>
            <div className="flex h-screen">
                <aside className="hidden md:flex md:w-sidebar bg-gray-100 h-full">
                    <SideBar>
                        <SideBarItem icon={<NewPostIcon />} active={true}>
                            New Post
                        </SideBarItem>
                        <SideBarItem icon={<AddChannelsIcon />} active={false}>
                            Add Channels
                        </SideBarItem>
                    </SideBar>
                </aside>

                <div className="flex-1 flex flex-col">
                    <div className="bg-gray-800 text-white p-6">Navbar</div>

                    <main className="flex-1 bg-white p-4">
                        <ContentUploadForm />
                    </main>
                </div>
            </div>
        </>
    );
}

export default App;

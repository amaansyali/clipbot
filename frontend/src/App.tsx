import SideBar from "../components/SideBar";
import SideBarItem from "../components/SideBarItem/SideBarItem";
import VideoUploadForm from "../components/VideoUploadForm";
import { NewPostIcon, AddChannelsIcon } from "./Icons";

import { Home } from "../pages/Home";
import { CreatePost } from "../pages/CreatePost";
import { AddChannels } from "../pages/AddChannels";
import { NoPage } from "../pages/NoPage";

import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="*" element={<NoPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/post" element={<CreatePost />} />
                <Route path="/addchannels" element={<AddChannels />} />
            </Routes>
        </HashRouter>
    );
}

export default App;

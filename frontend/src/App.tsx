import { HashRouter, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { CreatePost } from "../pages/CreatePost";
import { AddChannels } from "../pages/AddChannels";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { NoPage } from "../pages/NoPage";

import { useAuth } from "../context/AuthContext";

import { ProtectedRoute, PublicRoute } from "./routes/Routes";
import { AddChannelSuccess } from "../pages/AddChannelSuccess";
import { AddChannelError } from "../pages/AddChannelError";

interface Props {
    isLoggedIn: boolean
}

const DefaultRoute = ( { isLoggedIn } : Props ) => {

    return isLoggedIn ? <Dashboard /> : <Home />;
};

function App() {
    const { isLoggedIn } = useAuth();

    return (

            <HashRouter>
                <Routes>
                    <Route path="*" element={<NoPage />} />

                    <Route path="/" element={<DefaultRoute isLoggedIn={isLoggedIn}/>} />

                    <Route
                        path="/post"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/addchannels"
                        element={
                            <ProtectedRoute>
                                <AddChannels />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <SignUp />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/addchannel/success"
                        element={
                            <ProtectedRoute>
                                <AddChannelSuccess />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/addchannel/error"
                        element={
                            <ProtectedRoute>
                                <AddChannelError />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </HashRouter>
    );
}

export default App;

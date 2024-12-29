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
import { useEffect } from "react";
import apiClient from "../services/api-client";

interface Props {
    isLoggedIn: boolean
}

const DefaultRoute = ( { isLoggedIn } : Props ) => {

    return isLoggedIn ? <Dashboard /> : <Home />;
};

function App() {
    const TOKEN_EXPIRED = "TOKEN_EXPIRED"

    const { isLoggedIn, setIsLoggedIn } = useAuth();

    const refresh = async () => { // refresh the access token using refresh token
        try {
            await apiClient.post("/auth/refresh");
            console.log("Access token refreshed");
        } catch (error) {
            console.log("Token refresh failed, logging out");
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        const validateAndRefreshSession = async () => {

            try {
                const response = await apiClient.post("/auth/validate");
                if (response.data.isValid) {
                    console.log("User is logged in");
                    setIsLoggedIn(true);
                } else {
                    console.log("User session invalid, redirecting to login");
                    setIsLoggedIn(false);
                }

                const interval = setInterval(async () => {
                    refresh()
                }, 10 * 60 * 1000); // 10 min

                return () => clearInterval(interval);
            } catch (error: any) {
                if (error.error_message === TOKEN_EXPIRED) {
                    console.log("HELLO")
                    refresh()
                }
                console.error("Validation failed:", error);
                setIsLoggedIn(false);
            }
        };

        validateAndRefreshSession();
    }, [setIsLoggedIn]);

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

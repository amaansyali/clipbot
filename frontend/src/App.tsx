import { HashRouter, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { CreatePost } from "../pages/CreatePost";
import { AddChannels } from "../pages/AddChannels";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { NoPage } from "../pages/NoPage";

import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

import { ProtectedRoute, PublicRoute } from "./routes/Routes";

const DefaultRoute = () => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Dashboard /> : <Home />;
};

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="*" element={<NoPage />} />

                    <Route path="/" element={<DefaultRoute />} />

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
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;

import { Home } from "../pages/Home";
import { CreatePost } from "../pages/CreatePost";
import { AddChannels } from "../pages/AddChannels";
import { NoPage } from "../pages/NoPage";

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useState } from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    return (
        <HashRouter>
            <Routes>
                <Route path="*" element={<NoPage />} />
                <Route path="/" element={<Home />} />

                <Route
                    path="/post"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/addchannels"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <AddChannels />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </HashRouter>
    );
}

interface ProtectedRouteProps {
    isLoggedIn: boolean;
    children: ReactNode;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isLoggedIn,
    children,
}) => {
    if (!isLoggedIn) {
        // Redirect to Home or Login if not logged in
        return <Navigate to="/" replace />;
    }

    return children;
};

export default App;

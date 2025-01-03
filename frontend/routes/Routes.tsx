import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
    const { isLoggedIn, isAuthInitializing } = useAuth();

    if (isAuthInitializing) {
        return;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export const PublicRoute = ({ children }: Props) => {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

import { useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface LoginInfo {
    email: string;
    password: string;
}

const useLogin = () => {

    const [loginError, setLoginError] = useState< string | null>(null);
    const [isLoading, setLoading] = useState(false)

    const loginUser = async (loginInfo: LoginInfo) => {

        try {
            const formData = new FormData();
            formData.append("email", loginInfo.email)
            formData.append("password", loginInfo.password)

            setLoading(true)
            await apiClient.post("/login", formData, {});


        } catch (err: any) {
            if (err instanceof CanceledError) return;

            if (err.response) {
                console.log(err.response.data.message)
                setLoginError(err.response.data.message)
            } else {
                console.log(err.message)
                setLoginError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return { loginUser, isLoading, loginError };
}

export default useLogin
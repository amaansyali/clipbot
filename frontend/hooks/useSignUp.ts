import { useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

export interface SignUpData {
    email: string;
    password: string;
}

const useSignUp = () => {

    const [signUpError, setSignUpError] = useState< string | null>(null);
    const [isLoading, setLoading] = useState(false)

    const signUpUser = async (signUpData: SignUpData) => {

        try {
            const formData = new FormData();
            formData.append("email", signUpData.email)
            formData.append("password", signUpData.password)

            setLoading(true)
            await apiClient.post("/signup", formData, {});


        } catch (err: any) {
            if (err instanceof CanceledError) return;
            console.log(err)
            setSignUpError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { signUpUser, isLoading, signUpError };
}

export default useSignUp
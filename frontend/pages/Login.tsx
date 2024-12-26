import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useLogin from "../hooks/useLogin";
import { LoginInfo } from "../hooks/useLogin";
import { ROUTES } from "../../shared/routes";

const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),

    password: z.string().min(1, { message: "Password field is required" }),
});

type FormData = z.infer<typeof schema>;

export function Login() {
    const { loginUser, isLoading, loginError } = useLogin();

    const onSubmit = async (data: FormData) => {
        reset();

        const loginInfo: LoginInfo = {
            email: data.email,
            password: data.password,
        };
        try {
            await loginUser(loginInfo);
        } catch {
            console.log("Login failed:", loginError);
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    return (
        <>
            <div className="flex min-h-full my-20 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div>
                        <a href={ROUTES.HOME}>
                            <img
                                src="../../src/assets/ClipBot_logo.svg"
                                className="h-12 cursor-pointer mx-auto w-auto transform transition-transform duration-300 hover:scale-105"
                            />
                        </a>
                    </div>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-dark">
                        Log in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm/6 font-medium text-dark"
                            >
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register("email")}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-dark outline outline-1 -outline-offset-1 outline-medium-light placeholder:text-medium-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-main sm:text-sm/6"
                                />

                                {errors.email && (
                                    <div
                                        className="pt-2 mb-4 text-sm text-red-dark rounded-lg dark:text-red-light"
                                        role="alert"
                                    >
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm/6 font-medium text-dark"
                                >
                                    Password
                                </label>

                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-semibold text-primary-main hover:text-primary-hover"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    {...register("password")}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-dark outline outline-1 -outline-offset-1 outline-medium-light placeholder:text-medium-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-main sm:text-sm/6"
                                />

                                {errors.password && (
                                    <div
                                        className="pt-2 mb-4 text-sm text-red-dark rounded-lg dark:text-red-light"
                                        role="alert"
                                    >
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary-main px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                            >
                                Sign in
                            </button>
                            {loginError && (
                                <div
                                    className="pt-2 mb-4 text-sm text-red-dark rounded-lg dark:text-red-light"
                                    role="alert"
                                >
                                    {loginError}
                                </div>
                            )}
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-medium-light">
                        Don't have an account?{" "}
                        <a
                            href={ROUTES.SIGNUP}
                            className="font-semibold text-primary-main hover:text-primary-hover"
                        >
                            Sign Up Here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

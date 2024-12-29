import React from "react";
import { ROUTES } from "../../shared/routes";

export function AddChannelSuccess() {
    return (
        <div className="flex min-h-full my-20 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div>
                    <a href={ROUTES.HOME}>
                        <img
                            src="../../src/assets/ClipBot_logo.svg"
                            alt="ClipBot Logo"
                            className="h-12 cursor-pointer mx-auto w-auto transform transition-transform duration-300 hover:scale-105"
                        />
                    </a>
                </div>

                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-dark">
                    Channel Connected
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6 text-center">
                    <p className="text-sm text-medium-light">
                        Your channel has been successfully linked to your ClipBot profile.
                    </p>

                    <div>
                        <button
                            onClick={() => (window.location.href = ROUTES.ADD_CHANNELS)}
                            className="flex w-full justify-center rounded-md bg-primary-main px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                        >
                            Go to Channels Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

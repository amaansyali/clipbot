import React from "react"
import { ROUTES } from "../../shared/routes";

export function NoPage() {
    return (
        <>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-primary-main">
                        404
                    </p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-dark sm:text-7xl">
                        Page not found
                    </h1>
                    <p className="mt-6 text-pretty text-lg font-medium text-medium-dark sm:text-xl/8">
                        Sorry, we couldn't find the page you're looking for.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href={ROUTES.HOME}
                            className="rounded-md bg-primary-main px-3.5 py-2.5 text-sm font-semibold text-light shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                        >
                            Go back home
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
}

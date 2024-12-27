import React from "react"
import NavBar from "../components/NavBar";

export function Home() {

    return (
        <>
            <div className="flex h-screen">

                <div className="flex-1 flex flex-col">
                    <NavBar />

                    <main className="flex-1 bg-white p-4">Home</main>
                </div>
            </div>
        </>
    );
}

import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bell } from "../../src/Icons";

import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../../shared/routes";
import apiClient from "../../services/api-client";

const NavBar = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    console.log(isLoggedIn);

    const  signOut = async () => {
        try {
            await apiClient.post('/logout');

            window.location.href = '/login'; // Redirect to login
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    }

    return (
        <nav className="bg-white drop-shadow-md">
            <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
                {isLoggedIn ? (
                    <div className="flex h-16 items-center justify-end">
                        {/* Notification Icon */}
                        <button
                            type="button"
                            className="relative rounded-full p-2 text-medium-dark hover:text-medium-light focus:outline-none transform transition-transform duration-200 hover:scale-110"
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell />
                        </button>

                        {/* Profile Dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-white text-sm transform transition-transform duration-300 hover:scale-110">
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <img
                                        alt=""
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s"
                                        className="h-8 w-8 rounded-full"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none transform transition-all duration-200 ease-out scale-95 opacity-0 data-[open]:scale-100 data-[open]:opacity-100">
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-medium-dark hover:bg-light transition-colors duration-150"
                                    >
                                        Your Profile
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-medium-dark hover:bg-light transition-colors duration-150"
                                    >
                                        Settings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={signOut}
                                        className="block px-4 py-2 text-sm text-medium-dark hover:bg-light transition-colors duration-150"
                                    >
                                        Sign out
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="p-4">
                            <a href={ROUTES.HOME}>
                                <img
                                    src="../../src/assets/ClipBot_logo.svg"
                                    className="h-10 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                                />
                            </a>
                        </div>
                        <div>
                            <a
                                href={ROUTES.LOGIN}
                                className="rounded-md bg-primary-main px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                            >
                                Log In
                            </a>
                            <a
                                href={ROUTES.SIGNUP}
                                className="rounded-md ml-4 bg-primary-main px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;

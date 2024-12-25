import React from "react"

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bell } from "../../src/Icons";

const NavBar = () => {
    return (
        <nav className="bg-white drop-shadow-md">
            <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
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
                            <MenuButton className="relative flex rounded-full bg-dark text-sm transform transition-transform duration-300 hover:scale-110">
                                <span className="sr-only">Open user menu</span>
                                <img
                                    alt=""
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                                    href="#"
                                    className="block px-4 py-2 text-sm text-medium-dark hover:bg-light transition-colors duration-150"
                                >
                                    Sign out
                                </a>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

import { ReactNode } from "react";

import { ROUTES } from "../../src/routes";

import BurgerMenu from "./BurgerMenu";

interface Props {
    children: ReactNode;
    onChangeSideBar: () => void;
    isSidebarOpen: boolean;
}

const SideBar = ({ children, onChangeSideBar, isSidebarOpen }: Props) => {
    return (
        <aside className="h-full w-sidebar bg-slate-dark relative">
            <button
                className="absolute top-4 -right-10 md:hidden p-2 text-medium-light hover:text-medium-dark focus:outline-none rounded-full"
                onClick={onChangeSideBar}
            >
                <BurgerMenu isSidebarOpen={isSidebarOpen} />
            </button>

            <nav className="h-full flex flex-col shadow-sm">
                <div className="p-4">
                    <a href={ROUTES.HOME}>
                        <img
                            src="../../src/assets/ClipBot_logo_variant.svg"
                            className="h-10 cursor-pointer"
                        />
                    </a>
                </div>
                <ul className="flex-1 px-3 py-3">{children}</ul>
            </nav>
        </aside>
    );
};

export default SideBar;

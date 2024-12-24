import { ReactNode } from "react";

import { ROUTES } from "../../src/routes";

interface Props {
    children: ReactNode;
}

const SideBar = ({ children }: Props) => {
    return (
        <aside className="h-full w-sidebar bg-slate-900">
            <nav className="h-full flex flex-col shadow-sm">
                <div className=" p-4">
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

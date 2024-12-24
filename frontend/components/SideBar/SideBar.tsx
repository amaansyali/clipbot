import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const SideBar = ({ children }: Props) => {
    return (
        <aside className="h-full w-sidebar">
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="p-4 pb-2">
                    <img
                        src="../../src/assets/ClipBot_logo.svg"
                        className="h-10"
                    />
                </div>
                <ul className="flex-1 px-3 py-3">{children}</ul>
            </nav>
        </aside>
    );
};

export default SideBar;

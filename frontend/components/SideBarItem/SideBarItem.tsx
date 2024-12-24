import { ReactNode } from "react";

interface Props {
    icon: ReactNode;
    children: ReactNode;
    active: boolean;
    href: string;
}

const SideBarItem = ({ icon, children, active, href }: Props) => {
    return (
        <li
            className={`relative rounded cursor-pointer
        ${
            active
                ? "bg-slate-800 text-light"
                : "hover:bg-slate-800 hover:text-light text-medium-light"
        }
        `}
        >
            <a
                className="flex items-center py-2 px-2 my-2 font-medium"
                href={href}
            >
                {icon}
                <span className="ml-2 text-sm">{children}</span>
            </a>
        </li>
    );
};

export default SideBarItem;

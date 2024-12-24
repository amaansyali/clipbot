import { ReactNode } from "react";

interface Props {
    icon: ReactNode;
    children: ReactNode;
    active: boolean;
}

const SideBarItem = ({ icon, children, active }: Props) => {
    return (
        <li
            className={`relative flex items-center py-2 px-2 rounded my-2
        font-medium cursor-pointer
        ${
            active
                ? "bg-indigo-200 text-indigo-600"
                : "hover:bg-indigo-50 text-gray-600"
        }
        `}
        >
            {icon}
            <span className="ml-2">{children}</span>
        </li>
    );
};

export default SideBarItem;

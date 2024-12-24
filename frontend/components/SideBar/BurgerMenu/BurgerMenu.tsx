interface Props {
    isSidebarOpen: boolean;
}

const BurgerMenu = ({ isSidebarOpen }: Props) => {
    return (
        <>
            <span className="sr-only">Toggle Menu</span>

            <div className="relative h-5 w-5">
                <span
                    className={`absolute top-0.5 left-0 h-b w-full bg-medium-dark rounded transition-transform duration-300 ease-in-out ${
                        isSidebarOpen
                            ? "rotate-45 translate-y-1.5 bg-light"
                            : ""
                    }`}
                ></span>

                <span
                    className={`absolute top-2 left-0 h-b w-full bg-medium-dark rounded transition-opacity duration-300 ease-in-out ${
                        isSidebarOpen ? "opacity-0" : ""
                    }`}
                ></span>

                <span
                    className={`absolute bottom-1 left-0 h-b w-full bg-medium-dark rounded transition-transform duration-300 ease-in-out ${
                        isSidebarOpen
                            ? "-rotate-45 -translate-y-1.3 bg-light"
                            : ""
                    }`}
                ></span>
            </div>
        </>
    );
};

export default BurgerMenu;

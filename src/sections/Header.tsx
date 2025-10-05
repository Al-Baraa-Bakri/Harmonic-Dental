export const HeaderSection = () => {
    return (
        <header className="sticky top-0 z-50 bg-zinc-900/50 backdrop-blur-lg">
            <div className="px-10 md:px-20 lg:px-24 xl:px-28">
                <div className="flex justify-between items-center h-24 md:h-28">
                    <div>
                        <img src="./assets/images/logo.svg" alt="Harmonic Dental Logo" />
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Get Started Button */}
                        <button className="hidden md:block relative bg-harmonic-primary/20 px-4 py-2 font-extrabold uppercase font-heading text-sm tracking-wide ">
                            <div className="absolute inset-0 outline outline-2 -outline-offset-2 outline-harmonic-primary 
                            [mask-image:linear-gradient(225deg,transparent,transparent_10px,black_10px)]
                            "></div>
                            <span className="leading-6">Get Started</span>
                            <svg
                            className="absolute top-0 right-0 text-harmonic-primary"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 1H12.2667L23 11.7333V24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                ></path>
                            </svg>
                        </button>
                        <div className="size-10 relative">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
                                <div className="w-5 h-0.5 bg-zinc-300 -translate-y-1"></div>
                            </div>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
                                <div className="w-5 h-0.5 bg-zinc-300 translate-y-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
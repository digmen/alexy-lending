'use client';
import Link from "next/link";
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="max-w-[1400px] px-6 lg:px-10 pt-6 lg:pt-9 mx-auto z-10 relative">
            <div className="flex items-center justify-between">
                <div className="mr-auto">
                    <Link href="/" className="text-white cursor-pointer">
                        Logo
                    </Link>
                </div>

                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 justify-center gap-[1.875rem] border-2 border-[#c1c2d94d] rounded-full 
                        px-8 py-[0.9375rem] bg-[rgba(9,10,30,0.2)] backdrop-blur-sm 
                        lg:px-10 xl:px-20">
                    <Link href="/changelog" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Changelog
                    </Link>
                    <Link href="/roadmap" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Roadmap
                    </Link>
                    <a
                        href="https://your-feedback-url.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#c1c2d9] text-sm cursor-pointer"
                    >
                        Feedback
                    </a>
                    <Link href="/pricing" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Pricing
                    </Link>
                </div>

                <div className="hidden lg:flex ml-auto items-center gap-[1.875rem]">
                    <Link
                        href="/signin"
                        className="text-[#c1c2d9] text-sm font-medium cursor-pointer"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="text-[#252736] text-sm font-medium rounded-full bg-white px-5 py-2.5"
                    >
                        Get started free
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white text-2xl ml-auto z-20"
                >
                    {isOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[#090a1e] border-t border-[#c1c2d94d] flex flex-col items-center gap-6 py-6 z-10">
                    <Link href="/changelog" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Changelog
                    </Link>
                    <Link href="/roadmap" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Roadmap
                    </Link>
                    <a
                        href="https://your-feedback-url.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#c1c2d9] text-sm cursor-pointer"
                    >
                        Feedback
                    </a>
                    <Link href="/pricing" className="text-[#c1c2d9] text-sm cursor-pointer">
                        Pricing
                    </Link>
                    <Link
                        href="/signin"
                        className="text-[#c1c2d9] text-sm font-medium cursor-pointer"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="text-[#252736] text-sm font-medium rounded-full bg-white px-5 py-2.5"
                    >
                        Get started free
                    </Link>
                </div>
            )}
        </nav>
    );
}

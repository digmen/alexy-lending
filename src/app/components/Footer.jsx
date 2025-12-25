import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="relative w-full z-[1000] mt-auto px-20 py-6">
            <div className="w-full max-w-[83.75rem] mx-auto flex flex-row justify-between items-center">
                {/* Левая часть */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">{/* Логотип или соц. иконки */}</div>

                    <p className="text-[#6b6b84] text-sm">© Omital Group LLC 2025</p>

                    <p className="text-[#6b6b84] text-sm">
                        Live updates at{" "}
                        <a
                            target="_blank"
                            href="https://twitter.com/pablo_bonilla_"
                            className="text-[#6b6b84] text-sm hover:underline"
                        >
                            @pablo_bonilla_
                        </a>
                    </p>
                </div>

                {/* Правая часть */}
                <div className="flex flex-col mt-6 text-right">
                    <div className="flex flex-row gap-5">
                        <Link
                            href="/pricing"
                            className="text-[#9293aa] font-normal text-base hover:text-white transition"
                        >
                            Pricing
                        </Link>
                        <a
                            target="_blank"
                            href="/privacy-policy"
                            className="text-[#9293aa] font-normal text-base hover:text-white transition"
                        >
                            Privacy Policy
                        </a>
                        <a
                            target="_blank"
                            href="/terms-and-conditions"
                            className="text-[#9293aa] font-normal text-base hover:text-white transition"
                        >
                            Terms & Conditions
                        </a>
                    </div>

                    <p className="text-[#6b6b84] text-sm mt-2">
                        Contact us at support@motion.software
                    </p>
                </div>
            </div>
        </footer>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import HeroVideo, { BULGARIAN_SLOGANS } from "@/components/hero/hero-video";
import Logo from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Instagram, Globe, Ship, Car, Calendar, Palmtree, Building2, Plane } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CardPage() {
    const [sloganIndex, setSloganIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSloganIndex((prev) => (prev + 1) % BULGARIAN_SLOGANS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[100dvh] w-full overflow-hidden bg-neutral-950 flex items-center justify-center">

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4">

                {/* Glass Card */}
                <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10 flex flex-col max-h-full">

                    {/* Card Background Video */}
                    <div className="absolute inset-0 z-0">
                        <HeroVideo className="h-full w-full object-cover">
                            {/* Pass empty fragment to suppress default slogans in HeroVideo */}
                            <></>
                        </HeroVideo>
                    </div>

                    {/* Card Content */}
                    {/* <div className="relative z-10 flex flex-col h-full"> */}
                    {/* Header / Profile Section */}
                    <div className="flex flex-col items-center p-4 pb-2 text-center shrink-0">
                        <div className="mb-4 scale-110">
                            <Logo variant="default" />
                        </div>

                        <div className="h-12 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={sloganIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-lg md:text-xl font-bold text-white drop-shadow-md max-w-xs"
                                >
                                    {BULGARIAN_SLOGANS[sloganIndex]}
                                </motion.h1>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent shrink-0" />

                    {/* Scrollable Content Area if needed, though we aim for no scroll */}
                    <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto no-scrollbar">
                        {/* Contact Actions (List Layout) */}
                        <div className="grid gap-3 px-8 p-5 pb-2">
                            <a
                                href="tel:+359884081616"
                                className="group flex items-center gap-3 rounded-full bg-white/10 p-3 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex h-9 w-9 p-2 shrink-0 items-center justify-center rounded-full bg-blue-500/80 text-white shadow-lg group-hover:bg-blue-500">
                                    <Phone size={18} />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-white/60">Телефон</span>
                                    <span className="text-sm font-medium text-white">+359 884 081 616</span>
                                </div>
                            </a>

                            <a
                                href="mailto:reservation@global-travel.bg"
                                className="group flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex h-9 w-9 p-2 shrink-0 items-center justify-center rounded-full bg-purple-500/80 text-white shadow-lg group-hover:bg-purple-500">
                                    <Mail size={18} />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-white/60">Email</span>
                                    <span className="text-sm font-medium text-white break-all">reservation@global-travel.bg</span>
                                </div>
                            </a>

                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex h-9 w-9 p-2 shrink-0 items-center justify-center rounded-full bg-emerald-500/80 text-white shadow-lg group-hover:bg-emerald-500">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] text-white/60">Адрес</span>
                                    <span className="text-sm font-medium text-white">София, България</span>
                                </div>
                            </a>
                        </div>

                        {/* Grid Links (3 Columns) */}
                        <div className="grid grid-cols-3 gap-2 px-8 pb-2 pt-2">
                            {/* Row 1 */}
                            <Link href="/holidays" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Palmtree className="mb-1.5 size-8 text-green-400 group-hover:text-green-300" />
                                <span className="text-xs md:text-base font-medium text-white">Почивки</span>
                            </Link>
                            <Link href="/hotels" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Building2 className="mb-1.5 size-8 text-indigo-500 group-hover:text-indigo-300" />
                                <span className="text-xs md:text-base font-medium text-white">Хотели</span>
                            </Link>
                            <Link href="/flights" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Plane className="mb-1.5 size-8 text-sky-400 group-hover:text-sky-300" />
                                <span className="text-xs md:text-base font-medium text-white ">Самолетни билети</span>
                            </Link>

                            {/* Row 2 */}
                            <Link href="/yachts" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Ship className="mb-1.5 size-8 text-cyan-400 group-hover:text-cyan-300" />
                                <span className="text-xs md:text-base font-medium text-white">Яхти</span>
                            </Link>
                            <Link href="/rent-a-car" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Car className="mb-1.5 size-8 text-orange-400 group-hover:text-orange-300" />
                                <span className="text-xs md:text-base font-medium text-white">Rent a Car</span>
                            </Link>
                            <Link href="/?action=contact" className="group flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-md p-3 text-center transition-all hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98] aspect-square">
                                <Calendar className="mb-1.5 size-8 text-pink-400 group-hover:text-pink-300" />
                                <span className="text-xs md:text-base font-medium text-white">Запитване</span>
                            </Link>
                        </div>
                        {/* </div> */}

                        {/* Social Footer */}
                        <div className="flex items-center justify-center gap-6 bg-black/40 p-4 backdrop-blur-md shrink-0">
                            <a
                                href="https://facebook.com/@global.travel.bg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 p-1 rounded-[6px] transform text-white/80 transition-all hover:scale-110 "
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://instagram.com/globaltravel.mgmt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-1 rounded-[6px] transform text-white/80 transition-all hover:scale-110 "
                            >
                                <Instagram size={20} />
                            </a>

                        </div>
                    </div>

                </div>

                <div className="flex w-full max-w-md justify-between px-2">
                    <p className="mt-1 text-[10px] text-white/40">
                        © {new Date().getFullYear()} Global Travel Management
                    </p>
                    <p className=" text-white/40 text-[10px] mt-1">
                        Made with <span className="text-red-400">♡</span> by{" "}
                        <a
                            href="https://echoray.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            Echoray
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

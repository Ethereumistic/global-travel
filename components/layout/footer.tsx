"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import Logo from "@/components/layout/logo";

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Brand & Slogan */}
                    <div className="flex flex-col items-start space-y-6">
                        <Logo variant="primary" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-sm">
                            Ние сме експерти в пътешествията! Нека планираме и твоето перфектно пътуване!
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <Link
                                href="https://facebook.com/@global.travel.bg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                                aria-label="Facebook"
                            >
                                <Facebook size={24} />
                            </Link>
                            <Link
                                href="https://instagram.com/globaltravel.mgmt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-bl from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Information */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
                            Още информация
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors"></span>
                                    Често задавани въпроси
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors"></span>
                                    Политика за поверителност
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors"></span>
                                    Общи условия
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/license"
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-primary transition-colors"></span>
                                    Лиценз №5702
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contacts */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
                            Контакти
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="tel:+359884081616"
                                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <Phone size={20} className="text-primary shrink-0" />
                                    <span>+359 884081616</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+359888862348"
                                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <Phone size={20} className="text-primary shrink-0" />
                                    <span>+359 888862348</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:reservation@global-travel.bg"
                                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors break-all"
                                >
                                    <Mail size={20} className="text-primary shrink-0" />
                                    <span>reservation@global-travel.bg</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Clock size={20} className="text-primary shrink-0" />
                                <span>Работно време: 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Global Travel Management. Всички права запазени.
                    </p>
                    <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">
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
        </footer>
    );
};

export default Footer;

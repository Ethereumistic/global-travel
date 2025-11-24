"use client";

import React from "react";
import { Award, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LICENSE_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

function LicenseHero() {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % LICENSE_HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[400px] overflow-hidden flex items-center -mt-20">
            {/* Background Images */}
            <div className="absolute inset-0 z-0">
                {LICENSE_HERO_IMAGES.map((img, index) => (
                    <div
                        key={img}
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
                            index === currentImageIndex ? "opacity-100" : "opacity-0"
                        )}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 pt-20">
                <div className="flex flex-col justify-center items-center text-center text-white animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-6">
                        <Award className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl drop-shadow-md mb-4">
                        Лиценз
                    </h1>
                    <p className="text-lg text-gray-100 md:text-xl max-w-2xl drop-shadow-sm leading-relaxed">
                        Удостоверение за регистрация на туроператор и туристически агент
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LicensePage() {
    return (
        <main className="min-h-screen bg-slate-50/50">
            <LicenseHero />

            <div className="container mx-auto py-16 px-4 max-w-5xl">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Лиценз №5702
                            </h2>
                            <p className="text-slate-500 mt-1">
                                Глобал Травел Мениджмънт ООД
                            </p>
                        </div>
                        <Button asChild variant="outline" className="gap-2">
                            <a href="/license.pdf" download="Global-Travel-License.pdf">
                                <Download className="h-4 w-4" />
                                Изтегли PDF
                            </a>
                        </Button>
                    </div>

                    <div className="w-[55%] mx-auto bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <img
                            src="/license.png"
                            alt="License Global Travel Management"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

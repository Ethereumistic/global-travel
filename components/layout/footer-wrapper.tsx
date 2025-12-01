"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";

export default function FooterWithPathCheck() {
    const pathname = usePathname();

    // Hide footer on /card routes (including locale prefixes)
    const isCardPage = pathname === "/card" || pathname?.includes("/card");

    if (isCardPage) {
        return null;
    }

    return <Footer />;
}

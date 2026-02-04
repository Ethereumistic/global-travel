"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";

export default function FooterWithPathCheck() {
    const pathname = usePathname();

    // Hide footer on /card and /studio routes
    const isCardPage = pathname === "/card" || pathname?.includes("/card") || pathname?.includes("/studio");

    if (isCardPage) {
        return null;
    }

    return <Footer />;
}

"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/layout/nav-bar";

export default function NavBarWithPathCheck() {
    const pathname = usePathname();

    // Hide navbar on /card routes (including locale prefixes)
    const isCardPage = pathname === "/card" || pathname?.includes("/card");

    if (isCardPage) {
        return null;
    }

    return <NavBar />;
}

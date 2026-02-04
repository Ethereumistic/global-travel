"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/layout/nav-bar";

export default function NavBarWithPathCheck() {
    const pathname = usePathname();

    const isCardPage = pathname === "/card" || pathname?.includes("/card") || pathname?.includes("/studio");

    if (isCardPage) {
        return null;
    }

    return <NavBar />;
}

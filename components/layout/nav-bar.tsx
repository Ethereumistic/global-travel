"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react" // Added useRef
import {
  Menu, X, Phone, Mail, Sun, Moon, Construction, Trees, Building, Plane,
  TreePalm, MapPin, Sailboat, Search, Ticket, Hotel, Car,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Logo from "./logo"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// --- CONFIGURATION ---
const TRANSPARENT_STATIC_PAGES = [
  "/",
  "/holidays",
  "/hotels",
  "/flights",
  "/yachts",
  "/card",
  "/rent-a-car"
];

const TRANSPARENT_DYNAMIC_SECTIONS = [
  "/holidays",
  "/hotels",
  "/flights",
  "/rent-a-car",
  "/yachts",
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen) {
        const nav = document.querySelector('nav');
        if (nav && !nav.contains(event.target as Node)) {
          setMobileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  // --- PATH TRANSPARENCY LOGIC ---
  const isTransparentPage = React.useMemo(() => {
    if (!pathname) return false;
    let cleanPath = pathname.replace(/^\/(en|bg)/, "");
    if (cleanPath === "") cleanPath = "/";

    if (TRANSPARENT_STATIC_PAGES.includes(cleanPath)) return true;

    return TRANSPARENT_DYNAMIC_SECTIONS.some(section =>
      cleanPath.startsWith(`${section}/`)
    );
  }, [pathname]);


  const navItems = [
    {
      label: "Екскурзии и Почивки",
      href: "/holidays",
      icon: <TreePalm className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
    {
      label: "Хотели",
      href: "/hotels",
      icon: <Hotel className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
    {
      label: "Самолетни Билети",
      href: "/flights",
      icon: <Plane className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
    {
      label: "Rent a Car",
      href: "/rent-a-car",
      icon: <Car className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
    {
      label: "Трансфери",
      href: "/transfers",
      icon: <Car className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
    {
      label: "Яхти",
      href: "/yachts",
      icon: <Sailboat className="size-7 md:size-5 text-white block md:hidden xl:block" />,
    },
  ]

  const mobileMenuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  }

  const handleReserveClick = () => {
    setMobileOpen(false);
    const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/";

    const isDetailPage =
      (pathWithoutLocale.startsWith("/holidays/") && pathWithoutLocale.split("/").length > 2) ||
      (pathWithoutLocale.startsWith("/hotels/") && pathWithoutLocale.split("/").length > 2) ||
      (pathWithoutLocale.startsWith("/flights/") && pathWithoutLocale.split("/").length > 2) ||
      (pathWithoutLocale.startsWith("/rent-a-car") && pathWithoutLocale.split("/").length > 0) ||
      (pathWithoutLocale.startsWith("/transfers") && pathWithoutLocale.split("/").length > 0) ||
      (pathWithoutLocale.startsWith("/yachts/") && pathWithoutLocale.split("/").length > 2);

    if (isDetailPage) {
      const sidebar = document.getElementById("booking-sidebar");
      if (sidebar) {
        const yOffset = -82;
        const y = sidebar.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }

    const isHomePage = pathname === "/" || pathname === "/en" || pathname === "/bg";
    if (isHomePage) {
      // SCROLL FIX: Scroll to top immediately
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const params = new URLSearchParams(searchParams.toString());
      if (params.get("action") === "contact") {
        params.delete("action");
      } else {
        params.set("action", "contact");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      const localePrefix = pathname.startsWith("/en") ? "/en" : pathname.startsWith("/bg") ? "/bg" : "";
      router.push(`${localePrefix}/?action=contact`);
    }
  };

  const isContactMode = pathname && ["/", "/en", "/bg"].includes(pathname) && searchParams.get("action") === "contact";
  const buttonText = isContactMode ? "ТЪРСИ" : "РЕЗЕРВИРАЙ";
  const buttonIcon = isContactMode ? <Search className="size-6" /> : <Ticket className="size-6" />;

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div
          className={cn(
            "w-full bg-black/40 backdrop-blur-2xl",
            "transition-all duration-300 ease-in-out",
            !scrolled && isTransparentPage &&
            "md:bg-transparent md:backdrop-filter-none md:border-transparent"
          )}
        >
          <div className="mx-auto px-2  lg:px-6 xl:px-12">
            <div className="flex items-center justify-between h-20">
              <Logo />

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center  ">
                <NavigationMenu className="">
                  <NavigationMenuList>
                    {navItems.map((item) =>
                      "submenu" in item ? (
                        <NavigationMenuItem key={item.label}>
                          <NavigationMenuTrigger className="">
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={item.label}>
                          <NavigationMenuLink
                            asChild
                            className={navigationMenuTriggerStyle()}
                          >
                            <Link
                              href={item.href}
                              className="flex-row items-center gap-2 px-1 md:px-2 lg:px-4 "
                            >
                              {item.icon}
                              <span className=" md:text-sm xl:text-base 2xl:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                {item.label}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center gap-2">
                <AnimatedHamburgerButton
                  isOpen={mobileOpen}
                  onClick={() => setMobileOpen(!mobileOpen)}
                />
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="absolute top-20 left-0 right-0 z-40 md:hidden space-y-2 border-t border-border/10 pt-4 overflow-hidden bg-black/50 backdrop-blur-2xl "
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants as any}
            >
              {navItems.map((item) =>
                "submenu" in item ? (
                  <div key={item.label} className="space-y-2">
                    <div className="px-3 py-2 text-foreground font-medium ">
                      {item.label}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-8 py-4 text-white  text-xl"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex gap-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                )
              )}
              <Button
                size="lg"
                className="flex mx-auto my-8 text-xl"
                onClick={handleReserveClick}
              >
                <h1 className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  {buttonText}
                </h1>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <FloatingActionBtn
        onClick={handleReserveClick}
        icon={buttonIcon}
        text={buttonText}
      />
    </>
  )
}

// --- SUB COMPONENTS ---

const FloatingActionBtn = ({
  onClick,
  icon,
  text
}: {
  onClick: () => void,
  icon: React.ReactNode,
  text: string
}) => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Ref to hold the timeout ID so we can clear it
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShrunk(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handler for mouse enter: Clear any pending "shrink" actions immediately
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  // Handler for mouse leave: Don't shrink immediately! Wait a bit.
  // This prevents flickering if the mouse slips off the edge diagonally.
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms grace period
  };

  const showText = !isShrunk || isHovered;

  return (
    <div className="fixed bottom-2 right-2 md:right-4 z-50">
      <Button
        size="lg"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "rounded-full shadow-2xl transition-all duration-300 ease-in-out h-14",
          showText ? "px-6" : "px-0 w-14"
        )}
      >
        <div className="flex items-center justify-center">
          <div className="">
            {icon}
          </div>

          <AnimatePresence mode="wait">
            {showText && (
              <motion.span
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="whitespace-nowrap overflow-hidden text-lg font-semibold"
              >
                {text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Button>
    </div>
  );
};

const AnimatedHamburgerButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-2 text-white"
      aria-label="Toggle menu"
      animate={isOpen ? "open" : "closed"}
      initial={false}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
      >
        <motion.path
          d="M 4 8 L 20 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: 45, y: 4 },
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 4 12 L 20 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 4 16 L 20 16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: -45, y: -4 },
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.button>
  )
}
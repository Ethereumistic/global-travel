"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Phone,
  Mail,
  Sun,
  Moon,
  Construction,
  Trees,
  Building,
  Plane,
  TreePalm,
  MapPin,
  Sailboat,
  Search,
  Ticket,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Logo from "./logo"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() // Get current page path
  const router = useRouter()
  const searchParams = useSearchParams()

  // NEW: State to track scroll position
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    // NEW: Add scroll event listener
    const handleScroll = () => {
      // Set scrolled to true if user has scrolled more than 10px
      setScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, []) // Empty dependency array ensures this runs only on mount and unmount

  // NEW: Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen) {
        // Check if the click is outside the nav element
        // Since the menu is part of the nav, we can check if the click target is NOT inside the nav
        // However, the hamburger button is also inside the nav.
        // A simpler approach for this specific layout:
        // The menu takes up the full width below the bar. 
        // If we want to close it when clicking *outside* the menu, we usually mean clicking on the main content.
        // But the menu is absolute positioned.
        // Let's check if the click is NOT within the <nav> element.
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

  const navItems = [
    {
      label: "Дестинации",
      href: "/destinations",
      icon: <MapPin className="size-7 md:size-5 text-white" />,
    },
    {
      label: "Екскурзии",
      href: "/holidays",
      icon: <TreePalm className="size-7 md:size-5 text-white" />,
    },
    {
      label: "Самолетни Билети",
      href: "/flights", // Using /flights as a placeholder
      icon: <Plane className="size-7 md:size-5 text-white " />,
    },
    {
      label: "Яхти",
      href: "/yachts", // Using /flights as a placeholder
      icon: <Sailboat className="size-7 md:size-5 text-white " />,
    },
  ]

  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  }

  const handleReserveClick = () => {
    setMobileOpen(false);
    const isHomePage = pathname === "/" || pathname === "/en" || pathname === "/bg";
    if (isHomePage) {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("action") === "contact") {
        params.delete("action");
      } else {
        params.set("action", "contact");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      // If not on home page, go to home with contact action
      const localePrefix = pathname.startsWith("/en") ? "/en" : pathname.startsWith("/bg") ? "/bg" : "";
      router.push(`${localePrefix}/?action=contact`);
    }
  };

  const isContactMode = pathname && ["/", "/en", "/bg"].includes(pathname) && searchParams.get("action") === "contact";
  const buttonText = isContactMode ? "ТЪРСИ" : "РЕЗЕРВИРАЙ";
  const buttonIcon = isContactMode ? <Search className="size-6" /> : <Ticket className="size-6" />;
  return (
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
          !scrolled &&
          (pathname === "/en" || pathname === "/bg" ||
            pathname === "/bg/excursions" || pathname === "/en/excursions" ||
            pathname === "/bg/holidays" || pathname === "/en/holidays" ||
            pathname === "/en/destinations" || pathname === "/bg/destinations" ||
            pathname === "/bg/flights" || pathname === "/en/flights" ||
            pathname === "/bg/yachts" || pathname === "/en/yachts") &&
          "md:bg-transparent md:backdrop-filter-none md:border-transparent"
        )}
      >
        <div className="mx-auto  px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-20">
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-4 ">
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
                            className="flex-row items-center gap-2 px-2 lg:px-4 "
                          >
                            {item.icon}
                            <span className="md:text-base xl:text-lg 2xl:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
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

            {/* Right side - Contact & Theme */}
            <div className="hidden lg:flex items-center gap-4 pl-4">
              <Button
                size="lg"
                className="text-sm xl:text-base 2xl:text-lg"
                onClick={handleReserveClick}
              >
                {buttonIcon}
                {buttonText}
              </Button>
            </div>

            {/* Mobile menu button & theme toggle */}
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
  )
}

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

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string
    icon?: React.ReactNode
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-6">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
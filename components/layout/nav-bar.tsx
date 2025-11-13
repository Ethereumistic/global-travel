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
import { usePathname } from "next/navigation"

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname() // Get current page path

  // NEW: State to track scroll position
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    // NEW: Add scroll event listener
    const handleScroll = () => {
      // Set scrolled to true if user has scrolled more than 10px
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, []) // Empty dependency array ensures this runs only on mount and unmount

  const navItems = [
    {
      label: "Дестинации",
      href: "/destinations",
      icon: <MapPin className="size-5 text-white" />,
    },
    {
      label: "Екскурзии",
      href: "/excursions",
      icon: <TreePalm className="size-5 text-white" />,
    },
    {
      label: "Самолетни Билети",
      href: "/flights", // Using /flights as a placeholder
      icon: <Plane className="size-5 text-white" />,
    },

    // {
    //   label: "Услуги",
    //   submenu: [
    //     {
    //       label: "Пътно строителство и поддръжка",
    //       href: "/services?tab=roads",
    //       icon: <Construction className="w-4 h-4" />,
    //       description: "Изграждане и поддръжка на пътища, мостове и магистрали.",
    //     },
    //     {
    //       label: "Саниране и фасади",
    //       href: "/services?tab=facades",
    //       icon: <Building className="w-4 h-4" />,
    //       description: "Цялостни решения за обновяване и саниране на сгради.",
    //     },
    //     {
    //       label: "Градско и парково строителство",
    //       href: "/services?tab=urban",
    //       icon: <Trees className="w-4 h-4" />,
    //       description: "Озеленяване, паркови алеи и зони за отдих.",
    //     },
    //   ],
    // },

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

  return (
    // === CHANGED: Conditionally apply bg/border on desktop based on scroll ===
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/20 bg-secondary ", // Base styles (mobile-first)
        "transition-colors duration-300 ease-in-out", // Add a nice transition
        !scrolled && pathname === "/bg" && "/en" && "md:bg-transparent md:border-transparent"
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
                        {/* <ul className="grid w-[350px] gap-3 p-4 md:w-[450px]">
                          {item.submenu?.map((subitem) => (
                            <ListItem
                              key={subitem.label}
                              title={subitem.label}
                              href={subitem.href}
                              icon={subitem.icon}
                            >
                              {subitem.description}
                            </ListItem>
                          ))}
                        </ul> */}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href={item.href} className="flex-row items-center gap-2 px-2 lg:px-4">
                          {item.icon}
                          <span className="md:text-base xl:text-lg 2xl:text-xl">{item.label}</span>
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
          <Button size="lg" className="text-sm xl:text-base 2xl:text-lg">РЕЗЕРВИРАЙ</Button>

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
      {/* === CHANGED: Mobile Navigation (Now overlays) === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            // NEW: Added absolute positioning to overlay content
            // 'top-20' matches the 'h-20' of the header
            // 'bg-background' ensures it's not transparent
            className="absolute top-20 left-0 right-0 z-40 md:hidden space-y-2 border-t border-border pt-4 overflow-hidden bg-background"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants as any}
          >
            {/* {navItems.map((item) =>
              "submenu" in item ? (
                <div key={item.label} className="space-y-2">
                  <div className="px-3 py-2 text-foreground font-medium">
                    {item.label}
                  </div>
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className="flex items-center px-6 py-2 text-foreground/80 hover:text-primary gap-4 transition-colors text-sm"
                      onClick={() => setMobileOpen(false)}
                    >
                      {subitem.icon}
                      <span>{subitem.label}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )} */}
            <Button className="">РЕЗЕРВИРАЙ</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// === AnimatedHamburgerButton Component (Unchanged) ===
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
      className="p-2 text-secondary-foreground"
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

// === ListItem Helper Component (Unchanged) ===
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
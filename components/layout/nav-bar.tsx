"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Menu, // Kept for fallback, but AnimatedHamburgerButton is used
  X, // Kept for fallback, but AnimatedHamburgerButton is used
  Phone,
  Mail,
  Sun,
  Moon,
  Construction,
  Trees,
  Building,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

// NEW: Import motion and AnimatePresence for animations
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

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { label: "За нас", href: "/about" },
    {
      label: "Услуги",
      submenu: [
        {
          label: "Пътно строителство и поддръжка",
          href: "/services?tab=roads",
          icon: <Construction className="w-4 h-4" />,
          description: "Изграждане и поддръжка на пътища, мостове и магистрали.",
        },
        {
          label: "Саниране и фасади",
          href: "/services?tab=facades",
          icon: <Building className="w-4 h-4" />,
          description: "Цялостни решения за обновяване и саниране на сгради.",
        },
        {
          label: "Градско и парково строителство",
          href: "/services?tab=urban",
          icon: <Trees className="w-4 h-4" />,
          description: "Озеленяване, паркови алеи и зони за отдих.",
        },
      ],
    },
    { label: "Инвентар", href: "/inventory" },
    { label: "Новини", href: "#news" },
    { label: "Проекти", href: "/projects" },
    { label: "Контакти", href: "/contact" },
  ]

  // NEW: Variants for the mobile menu slide-down animation
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: "auto", // Animate to its natural height
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0, // Animate to 0 height
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo (Unchanged) */}
          {/* <Link href="/" className="flex items-center gap-2 shrink-0"> */}
            {/* <div className="relative">
              <Image
                src="https://cdn.jsdelivr.net/gh/Ethereumistic/ultrabuild-assets/logo.png"
                alt="Ultrabuild"
                width={180}
                height={180}
              />
            </div> */}
            <Logo />
          {/* </Link> */}

          {/* Desktop Navigation (Unchanged) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) =>
                  "submenu" in item ? (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[350px] gap-3 p-4 md:w-[450px]">
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
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Contact & Theme (Unchanged) */}
          <div className="hidden lg:flex items-center gap-4 border-l border-border pl-4">


          <div className="flex items-center lg:flex-col lg:items-start xl:flex-row  gap-3 xl:text-sm text-xs">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-primary" />
            <a
              href="tel:0893277266"
              className="text-foreground hover:text-primary transition-colors"
            >
              0893 277 266
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-primary" />
            <a
              href="mailto:office@ultrabuild.bg"
              className="text-foreground hover:text-primary transition-colors"
            >
              office@ultrabuild.bg
            </a>
          </div>
        </div>

          </div>



          {/* === CHANGED: Mobile menu button & theme toggle === */}
          <div className="flex">
          {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-foreground hover:bg-muted rounded-md"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          <div className="flex md:hidden items-center gap-2">

            {/* NEW: Replaced the old button with the animated one */}
            <AnimatedHamburgerButton
              isOpen={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </div>
        </div>
        {/* === CHANGED: Mobile Navigation === */}
        {/* NEW: Wrapped in AnimatePresence for open/close animation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden  space-y-2 border-t border-border pt-4 overflow-hidden" // NEW: Added overflow-hidden
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants as any}
            >
              {/* The content inside is unchanged, but it will now animate */}
              {navItems.map((item) =>
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
                ),
              )}
              <div className="flex justify-between items-center gap-2 px-8 py-4 border-t border-border text-sm">
                <a
                  href="tel:0893277266"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  0893 277 266
                </a>
                <a
                  href="mailto:office@ultrabuild.bg"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  office@ultrabuild.bg
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// === NEW: AnimatedHamburgerButton Component ===
// A self-contained component for the animated hamburger/X icon
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
      className="p-2 text-foreground"
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
        className="w-6 h-6" // Match the original size
      >
        <motion.path
          d="M 4 8 L 20 8" // Top line
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: 45, y: 4 }, // Rotates and moves to center
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 4 12 L 20 12" // Middle line
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 }, // Fades out
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 4 16 L 20 16" // Bottom line
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            closed: { rotate: 0, y: 0 },
            open: { rotate: -45, y: -4 }, // Rotates and moves to center
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
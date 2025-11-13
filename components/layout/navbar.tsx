"use client"

import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import Logo from "./logo"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [language, setLanguage] = useState<"EN" | "BG">("EN")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const services = [
    { title: "Web Development", href: "/web-dev" },
    { title: "Interface Design", href: "/interface-design" },
    { title: "Search Engine Optimization", href: "/seo" },
    { title: "Branding", href: "/branding" },
  ]

  const pricing = [
    { title: "Hobby", href: "/hobby" },
    { title: "Individual", href: "/individual" },
    { title: "Team", href: "/team" },
    { title: "Enterprise", href: "/enterprise" },
  ]

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/20 border-slate-200/20"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">

              <Logo />
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Services */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "  ",
                    isScrolled ? "text-white hover:text-slate-200" : "text-white hover:text-slate-200",
                  )}
                >
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid gap-3">
                      {services.map((service) => (
                        <NavigationMenuLink
                          key={service.href}
                          href={service.href}
                          className="bg-transparent select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none "
                        >
                          <div className="text-sm font-medium ">{service.title}</div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "transition-colors duration-300",
                    isScrolled ? "text-slate-900 hover:text-slate-600" : "text-white hover:text-slate-200",
                  )}
                >
                  Pricing
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid gap-3">
                      {pricing.map((plan) => (
                        <NavigationMenuLink
                          key={plan.href}
                          href={plan.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                        >
                          <div className="text-sm font-medium text-slate-900">{plan.title}</div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About Link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/about"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10",
                  )}
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side: Language Switcher & CTA */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors duration-300",
                    isScrolled ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10",
                  )}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("EN")} className={language === "EN" ? "bg-slate-100" : ""}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("BG")} className={language === "BG" ? "bg-slate-100" : ""}>
                  Български
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact Button */}
            <Button
              variant="destructive"
              className={cn(
                "transition-all duration-300",
                isScrolled ? "" : "bg-white/20 hover:bg-white/30 text-white",
              )}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

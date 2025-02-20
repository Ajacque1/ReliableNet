"use client"

import { Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function Navigation() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Wifi className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ReliableNet
            </span>
          </div>

          {/* Navigation Items */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Find Reviews</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="/complexes" className="block p-3 hover:bg-accent rounded-lg">
                          <div className="text-sm font-medium mb-1">Apartment Reviews</div>
                          <p className="text-sm text-muted-foreground">
                            Find internet reviews for apartment complexes
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="/isp-comparison" className="block p-3 hover:bg-accent rounded-lg">
                          <div className="text-sm font-medium mb-1">ISP Comparison</div>
                          <p className="text-sm text-muted-foreground">
                            Compare internet service providers
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  href="/reviews" 
                  className="px-4 py-2 hover:text-primary transition-colors"
                >
                  Reviews
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
} 
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
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { SignInModal } from "./SignInModal"

export function Navigation() {
  const { data: session } = useSession()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Wifi className="h-6 w-6 text-primary" strokeWidth={2.5} />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ReliableNet
              </span>
            </Link>

            {/* Navigation Items */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Find Reviews</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/complexes" className="block p-3 hover:bg-accent rounded-lg">
                            <div className="text-sm font-medium mb-1">Apartment Reviews</div>
                            <p className="text-sm text-muted-foreground">
                              Find internet reviews for apartment complexes
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/isp-comparison" className="block p-3 hover:bg-accent rounded-lg">
                            <div className="text-sm font-medium mb-1">ISP Comparison</div>
                            <p className="text-sm text-muted-foreground">
                              Compare internet service providers
                            </p>
                          </Link>
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
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setIsSignInModalOpen(true)}>
                    Sign In
                  </Button>
                  <Link href="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </>
  )
} 
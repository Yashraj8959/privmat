"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from "./ui/button";
import { useTheme } from "next-themes"
import {Fingerprint, ShieldQuestion, LayoutDashboard,ChevronDown, Moon, Sun, TrendingUp, BracesIcon } from "lucide-react"
import Link from 'next/link'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    } from "@clerk/nextjs";


export const Header = () => {
    
    const { setTheme } = useTheme()
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link href="/">
          <Image
            src={"/privmatLogo.png"}
            alt="PrivMat"
            width={200}
            height={80}
            className="h-14 py-1 w-auto object-contain "
          />
        </Link>
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href="/">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2" >
                  <Fingerprint className="h-4 w-4" />
                  <span className="hidden md:block">Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/apps" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Apps Tracking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/fake-data"
                    className="flex items-center gap-2"
                  >
                    <BracesIcon className="h-4 w-4" />
                    FakeData Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/breaches" className="flex items-center gap-2">
                    <ShieldQuestion className="h-4 w-4" />
                    Data Breaches
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            //   afterSignOutUrl="/"
            />
          </SignedIn>

        {/* toggle mode for themes */}
        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
        </DropdownMenu>
        
        </div>
      </nav>
    </header>
  )
}

export default Header

"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from "./ui/button";
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import Link from 'next/link'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export const Header = () => {
    
    const { setTheme } = useTheme()
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* <Link href="/">
          <Image
            src={"/privmatLogo.png"}
            alt="PrivMat"
            width={200}
            height={60}
            className="h-14 py-1 w-auto object-contain "
          />
        </Link> */}
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
        
      </nav>
    </header>
  )
}

export default Header

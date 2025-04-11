import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderServer from "@/components/HeaderServer";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes'
import { Toaster } from "react-hot-toast"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrivMat",
  description: "Your Privacy Matters",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <HeaderServer />
            {/* main content */}
            {children}
            <Toaster />

          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

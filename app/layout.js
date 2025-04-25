import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderServer from "@/components/HeaderServer";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes'
import { Toaster } from "react-hot-toast"
import Footer from "@/components/Footer";


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
            {/* <div className="fixed inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}
            <div className="fixed -z-50 h-full w-full bg-slate-950">
            {/* Left Gradient Circle */}
              <div className="absolute top-[-20%] left-[-40%] sm:left-[-30%] md:left-[-20%] h-[60vw] w-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
  
            {/* Right Gradient Circle */}
              <div className="absolute top-[-20%] right-[-40%] sm:right-[-30%] md:right-[-20%] h-[60vw] w-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
            </div>

            {/* header */}
            <HeaderServer />
            {/* main content */}
            {children}
            <Toaster />
            {/* Footer */}
            <Footer />

          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

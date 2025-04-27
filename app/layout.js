import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderServer from "@/components/HeaderServer";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes'
import { Toaster } from "react-hot-toast"
import Footer from "@/components/Footer";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // You can customize
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // You can customize
});
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"], // You can customize
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
        className={` ${inter.variable} ${spaceGrotesk.variable} antialiased bg-slate-950`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="absolute  -z-50 h-full w-full bg-slate-950">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>
            {/* header */}
            <HeaderServer />
            {/* main content */}
            {children}
            <Toaster />
            {/* Footer */}
            {/* Slight fade into footer */}
            <div className="h-32 bg-gradient-to-b from-slate-900 to-slate-950"><Footer /></div>
            

          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

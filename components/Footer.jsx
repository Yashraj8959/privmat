// components/Footer.jsx

import Link from 'next/link';
import Image from 'next/image'; // If using the logo

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left Side: Copyright & Logo/Name */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block mb-2 md:mb-0">
              {/* Option 1: Logo */}
              <Image
                src={"/privmatLogo.png"} // Adjust path if needed
                alt="PrivMat Logo"
                width={120} // Smaller size for footer
                height={48}
                className="h-8 w-auto object-contain"
              />
              {/* Option 2: Text Name */}
               {/* <span className="text-lg font-semibold">Privmat</span> */}
            </Link>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Privmat. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Your Privacy Matters.
            </p>
          </div>

          {/* Right Side: Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            {/* Add more links as needed */}
            {/* <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </Link> */}
            {/* <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link> */}
          </nav>

          {/* Optional: Social Media Icons */}
          {/* <div className="flex space-x-4">
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
            <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
          </div> */}

        </div>
      </div>
    </footer>
  );
};

export default Footer;
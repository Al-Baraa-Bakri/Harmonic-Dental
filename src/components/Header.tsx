import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { getImageSrc } from "@/lib/utils";
import Logo from "@/assets/logo.png";
// Types
type NavItem = {
  label: string;
  href: string;
};

// Constants
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "The Newst Technology", href: "/technology" },
  { label: "Emergency Cases", href: "/emergency-cases" },
  { label: "Contact Us", href: "#contact-us" },
];

const CONTACT_INFO = {
  phone: "+1 (555) 123-4567",
} as const;

// Pure CSS Mobile Menu (No JavaScript needed!)
export const Header = () => {
  return (
    <>
      {/* CSS for mobile menu toggle */}
      <style>{`
        /* Hide checkbox */
        #mobile-menu-toggle {
          display: none;
        }

        /* Mobile menu hidden by default */
        #mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        /* Show mobile menu when checkbox is checked */
        #mobile-menu-toggle:checked ~ #mobile-menu {
          max-height: 500px;
          padding-bottom: 24px
        }

        /* Swap hamburger/close icons */
        #mobile-menu-toggle:checked ~ div .menu-open-icon {
          display: none;
        }
        
        #mobile-menu-toggle:not(:checked) ~ div .menu-close-icon {
          display: none;
        }

        /* Close menu when clicking nav link */
        @media (max-width: 1023px) {
          .nav-link:active ~ #mobile-menu {
            max-height: 0;
          }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10">
        <div className="container mx-auto px-6">
          {/* Hidden checkbox for menu state */}
          <input 
            type="checkbox" 
            id="mobile-menu-toggle" 
            aria-hidden="true"
          />

          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 w-28 lg:w-40">
              <img src={getImageSrc(Logo)} alt="Harmonic Dental" />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <a href={`tel:${CONTACT_INFO.phone}`}>
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.phone}</span>
                </a>
              </Button>
              <Button variant="default" size="sm" className="gap-2" asChild>
                <a href="#contact-us">
                  <Mail className="w-4 h-4" />
                  Get Quote
                </a>
              </Button>
            </div>

            {/* Mobile Menu Toggle Label */}
            <label
              htmlFor="mobile-menu-toggle"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer relative z-50"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-primary menu-open-icon" />
              <X className="w-5 h-5 text-primary menu-close-icon absolute" />
            </label>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" className="lg:hidden">
            <nav className="flex flex-col gap-4 mb-6" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link text-sm text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border/50"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Button variant="ghost" size="sm" className="gap-2 justify-start" asChild>
                <a href={`tel:${CONTACT_INFO.phone}`}>
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.phone}</span>
                </a>
              </Button>
              <Button variant="default" size="sm" className="gap-2 w-full" asChild>
                <a href="#contact-us">
                  <Mail className="w-4 h-4" />
                  Get Quote
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
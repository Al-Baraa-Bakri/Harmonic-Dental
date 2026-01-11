import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  type LucideIcon,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Icon mapping for social platforms
const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

// Helper to get social icon
const getSocialIcon = (platform: string): LucideIcon => {
  const key = platform.toLowerCase();
  return SOCIAL_ICON_MAP[key];
};

const Footer = ({
  logo,
  description = "Crafting excellence in dental solutions with cutting-edge technology and unmatched precision. Your trusted partner in dental prosthetics.",
  phoneNumber = "+1 (555) 123-4567",
  email = "info@dentallab.com",
  address = "123 Dental Street, Suite 100\nNew York, NY 10001",
  navigationColumns = [],
  companyName = "Harmonic Dental",
  socialLinks = [],
}: any) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-background to-background/50 border-t border-primary/10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <a
                href="/"
                className="flex items-center gap-3 w-40 mb-4 translate-x-[-10px]"
              >
                {logo?.url ? (
                  <img
                    src={logo.url}
                    alt={logo.alternativeText || companyName}
                    width={logo.width || 160}
                    height={logo.height || 60}
                    crossOrigin="anonymous"
                    className="w-full h-auto"
                  />
                ) : (
                  <span className="text-xl font-bold text-gradient">
                    {companyName}
                  </span>
                )}
              </a>

              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{phoneNumber}</span>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>{email}</span>
                  </a>
                )}

                {address && (
                  <div className="flex items-start gap-3 text-sm text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="whitespace-pre-line">{address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Columns */}
            {navigationColumns.map((column: any) => (
              <div key={column.id}>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link: any) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={
                          link.isExternal ? "noopener noreferrer" : undefined
                        }
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {companyName}. All rights reserved.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((social: any) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <Button
                      key={social.id}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-lg hover:bg-primary/20"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

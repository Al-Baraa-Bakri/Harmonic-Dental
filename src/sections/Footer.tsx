import { Phone, Mail, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navigation = {
    products: [
      { name: "Crowns & Bridges", href: "#products" },
      { name: "Implants", href: "#products" },
      { name: "Dentures", href: "#products" },
      { name: "Veneers", href: "#products" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Technology", href: "#technology" },
      { name: "Quality Standards", href: "#about" },
      { name: "Certifications", href: "#about" },
    ],
    support: [
      { name: "Contact", href: "#contact" },
      { name: "FAQs", href: "#contact" },
      { name: "Shipping", href: "#contact" },
      { name: "Returns", href: "#contact" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-background/50 border-t border-primary/10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-primary-foreground">DL</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gradient">DentalLab</h2>
                  <p className="text-xs text-muted-foreground">Precision Prosthetics</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Crafting excellence in dental solutions with cutting-edge technology and unmatched precision. Your trusted partner in dental prosthetics.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="tel:+15551234567" 
                  className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </a>
                
                <a 
                  href="mailto:info@dentallab.com" 
                  className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>info@dentallab.com</span>
                </a>
                
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>123 Dental Street, Suite 100<br />New York, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Products Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Products</h3>
              <ul className="space-y-3">
                {navigation.products.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} DentalLab. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-lg hover:bg-primary/10"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

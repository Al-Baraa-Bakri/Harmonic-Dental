import { Mail, Phone, MapPin } from "lucide-react";

import GoogleMap from "../components/GoogleMap";

const ContactSection = () => {
  const emails = [
    { label: "General Inquiries", email: "info@dentalab.com" },
    { label: "Technical Support", email: "support@dentalab.com" },
    { label: "Orders & Quotes", email: "orders@dentalab.com" },
  ];

  const phones = [
    { label: "Main Office", number: "+1 (555) 123-4567" },
    { label: "Technical Line", number: "+1 (555) 123-4568" },
    { label: "Emergency Service", number: "+1 (555) 123-4569" },
  ];

  return (
    <section id="contact-us" className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
    
         <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
                <Phone className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-xs text-foreground/90">Contact Us</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
                To start your amazing journey {" "}
                <span className="block text-gradient mt-1">Get in touch with us</span>
              </h2>

              <p className="text-sm md:text-base text-muted-foreground tech-description">
                We're here to help. Reach out to us through any of the channels below.
              </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Section */}
          <div className="group relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative h-full bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Email Us</h3>
              </div>
              <div className="space-y-4">
                {emails.map((item, index) => (
                  <div 
                    key={index} 
                    className="group/item p-4 bg-background/50 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <a 
                      href={`mailto:${item.email}`}
                      className="text-foreground font-medium hover:text-primary transition-colors duration-200 flex items-center gap-2 group-hover/item:gap-3"
                    >
                      {item.email}
                      <span className="text-primary opacity-0 group-hover/item:opacity-100 transition-all duration-300">→</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phone Section */}
          <div className="group relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative h-full bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Call Us</h3>
              </div>
              <div className="space-y-4">
                {phones.map((item, index) => (
                  <div 
                    key={index} 
                    className="group/item p-4 bg-background/50 rounded-lg hover:bg-accent/10 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <a 
                      href={`tel:${item.number.replace(/\s/g, '')}`}
                      className="text-foreground font-medium hover:text-accent transition-colors duration-200 flex items-center gap-2 group-hover/item:gap-3"
                    >
                      {item.number}
                      <span className="text-accent opacity-0 group-hover/item:opacity-100 transition-all duration-300">→</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <GoogleMap />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

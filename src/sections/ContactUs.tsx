import GoogleMap from "@/components/GoogleMap";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = ({
  headerBadge = "Contact Us",
  headerTitle = "To start your amazing journey",
  headerHighlightedText = "Get in touch with us",
  headerSubtitle = "We're here to help. Reach out to us through any of the channels below.",
  emails = [],
  phones = [],
  locationTitle,
  mapUrl,
  locations = []
}: any) => {
  return (
    <section
      id="contact-us"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
            <Phone className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-foreground/90">{headerBadge}</span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
            {headerTitle}{" "}
            <span className="block text-gradient mt-1">
              {headerHighlightedText}
            </span>
          </h2>

          <p className="text-sm md:text-base text-muted-foreground tech-description">
            {headerSubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Section */}
          {emails.length > 0 && (
            <div
              className="group relative animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative h-full bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Email Us
                  </h3>
                </div>
                <div className="space-y-4">
                  {emails.map((item: any, index: any) => (
                    <a
                      key={item.id}
                      href={`mailto:${item.value}`}
                      className="group/item block p-4 bg-background/50 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <div className="text-foreground font-medium transition-colors duration-200 flex items-center gap-2 group-hover/item:gap-3 group-hover/item:text-primary">
                        {item.value}
                        <span className="text-primary opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phone Section */}
          {phones.length > 0 && (
            <div
              className="group relative animate-fade-in cursor-pointer"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="border-2 border-primary/30 relative h-full bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Call Us
                  </h3>
                </div>
                <div className="space-y-4">
                  {phones.map((item: any, index: any) => (
                    <a
                      key={item.id}
                      href={`tel:${item.value.replace(/\s/g, "")}`}
                      className="group/item block p-4 bg-background/50 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/10"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      <div className="text-foreground font-medium transition-colors duration-200 flex items-center gap-2 group-hover/item:gap-3 group-hover/item:text-primary">
                        {item.value}
                        <span className="text-primary opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                          →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Section */}
        {mapUrl && (
          <div
            className="mt-16 max-w-5xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {locationTitle && (
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  {locationTitle}
                </h3>
              </div>
            )}
            {/* <GoogleMap
              embedUrl={mapUrl}
              title={locationTitle || "Our Location"}
            /> */}

            {locations.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {locations.map((location: any, index: any) => (
                  <div
                    key={location.id}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {location.text}
                          </h4>
                          {location.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {location.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;

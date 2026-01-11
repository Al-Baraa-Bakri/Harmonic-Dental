import {
  ArrowLeft,
  Sparkles,
  Play,
  ScanFace,
  Camera,
  Cpu,
  Scan,
  Printer,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  ProcessedTechnologyItem,
  ProcessedTechnologyPage,
} from "@/lib/api/technology-page";

// Icon mapping by icon name or slug
const ICON_MAP: Record<string, LucideIcon> = {
  "scan-face": ScanFace,
  face: ScanFace,
  camera: Camera,
  photogrammetry: Camera,
  cpu: Cpu,
  cad: Cpu,
  scan: Scan,
  intraoral: Scan,
  printer: Printer,
  print: Printer,
  palette: Palette,
  color: Palette,
  shade: Palette,
};

// Helper to get icon for a technology
const getIconForTechnology = (item: ProcessedTechnologyItem): LucideIcon => {
  const icon = item.icon?.toLowerCase() || "";
  const slug = item.slug?.toLowerCase() || "";

  // Try icon name first
  if (icon && ICON_MAP[icon]) return ICON_MAP[icon];

  // Try slug
  if (ICON_MAP[slug]) return ICON_MAP[slug];

  // Check slug contains keywords
  for (const [key, IconComponent] of Object.entries(ICON_MAP)) {
    if (slug.includes(key)) return IconComponent;
  }

  // Default fallback
  return Sparkles;
};

const TechnologyPage = ({
  heroTitle = "The Newest",
  heroHighlightedText = "Technology",
  heroSubtitle = "Explore cutting-edge dental technology that transforms precision and efficiency in every restoration.",
  backButtonText = "Back to Home",
  technologyItems = [],
}: ProcessedTechnologyPage) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-1000" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Back Button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{backButtonText}</span>
          </a>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              style={{ animation: "fade-in 0.6s ease-out 0.2s both" }}
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-foreground/90">
                Innovation & Precision
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 !leading-[130%]"
              style={{ animation: "fade-in 0.6s ease-out 0.4s both" }}
            >
              {heroTitle}{" "}
              <span className="block text-gradient mt-2">
                {heroHighlightedText}
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              style={{ animation: "fade-in 0.6s ease-out 0.6s both" }}
            >
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Technologies Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {technologyItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No Technologies Yet
              </h3>
              <p className="text-muted-foreground">
                Technology items will appear here once added.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technologyItems.map((item: any, index: any) => {
                const Icon = getIconForTechnology(item);
                const animationDelay = 0.1 * index;

                return (
                  <div
                    key={item.id}
                    className="group relative"
                    style={{
                      animation: `fade-in 0.6s ease-out ${animationDelay}s both`,
                    }}
                  >
                    {/* Card */}
                    <div className="relative h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl">
                      <a href="#contact-us">
                        {/* Image/Video Section */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                          {item.image?.url ? (
                            <>
                              <img
                                src={item.image.url}
                                alt={item.image.alternativeText || item.name}
                                width={item.image.width || 600}
                                height={item.image.height || 400}
                                loading="lazy"
                                decoding="async"
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon className="w-24 h-24 text-primary/20" />
                            </div>
                          )}

                          {/* Badge */}
                          {item.badge && (
                            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-0 shadow-lg">
                              {item.badge}
                            </Badge>
                          )}

                          {/* Featured Badge */}
                          {item.featured && (
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/90 backdrop-blur-sm border border-accent shadow-lg">
                                <Sparkles className="w-3 h-3 text-accent-foreground" />
                                <span className="text-xs font-medium text-accent-foreground">
                                  Featured
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Play Button for Videos */}
                          {item.videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                                <Play
                                  className="w-7 h-7 text-primary-foreground ml-1"
                                  fill="currentColor"
                                />
                              </div>
                            </div>
                          )}

                          {/* Icon Badge */}
                          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
                            {item.name}
                          </h3>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Features */}
                          {item.features.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.features.map((feature: any) => (
                                <span
                                  key={feature.id}
                                  className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                                >
                                  {feature.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA (Optional) */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover how our advanced technology can transform your dental
              solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group" asChild>
                <a href="#contact-us">
                  Get Started
                  <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/products">View Products</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;

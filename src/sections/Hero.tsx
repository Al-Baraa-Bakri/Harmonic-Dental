import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Crown,
  Box,
  Layers,
  Gem,
  Smile,
  Braces,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { getImageSrc } from "@/lib/utils";
import type { ProcessedHeroSection } from "@/types/strapi";

// Types
type StrapiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
  badge?: string;
  featured: boolean;
  order: number;
};

type StrapiStat = {
  id: number;
  value: string;
  label: string;
  order: number;
};

// Icon mapping by product slug or name (case-insensitive)
const ICON_MAP: Record<string, LucideIcon> = {
  // By slug
  crowns: Crown,
  crown: Crown,
  "product-1": Crown,

  bridges: Layers,
  bridge: Layers,

  implants: Box,
  implant: Box,
  "product-2": Box,

  veneers: Gem,
  veneer: Gem,
  "product-5": Gem,

  dentures: Smile,
  denture: Smile,

  orthodontics: Braces,
  orthodontic: Braces,

  // By name (case-insensitive match)
  "removable appliance": Smile,
  "product-3": Smile,

  "surgical guide": Activity,
  "product-4": Activity,
};

// Helper to get icon for a product
const getIconForProduct = (product: StrapiProduct): LucideIcon => {
  const slug = product.slug?.toLowerCase() || "";
  const name = product.name?.toLowerCase() || "";

  // Try slug first
  if (ICON_MAP[slug]) return ICON_MAP[slug];

  // Try name
  if (ICON_MAP[name]) return ICON_MAP[name];

  // Default fallback
  return Box;
};

// Animation styles removed for better LCP performance

// Memoized sub-components
const BackgroundLayer = memo(
  ({ backgroundImage }: { backgroundImage?: { url: string } }) => (
    <>
    <img src="/favicon180x180.png" alt="" />
      {/* Animated glow orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[140px] animate-pulse delay-1000" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
    </>
  )
);

BackgroundLayer.displayName = "BackgroundLayer";

const HeroBadge = memo(({ badgeText }: { badgeText: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
    <span className="text-sm text-foreground/90">{badgeText}</span>
  </div>
));

HeroBadge.displayName = "HeroBadge";

const HeroHeading = memo(
  ({
    mainHeading,
    highlightedText,
    subtitle,
  }: {
    mainHeading: string;
    highlightedText: string;
    subtitle: string;
  }) => (
    <>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        {mainHeading}{" "}
        <span className="block text-gradient mt-2 leading-[130%]">
          {highlightedText}
        </span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
        {subtitle}
      </p>
    </>
  )
);

HeroHeading.displayName = "HeroHeading";

const CTAButtons = memo(
  ({
    primaryButton,
    secondaryButton,
  }: {
    primaryButton?: { label: string; url: string; isExternal: boolean };
    secondaryButton?: { label: string; url: string; isExternal: boolean };
  }) => {
    if (!primaryButton && !secondaryButton) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        {primaryButton && (
          <Button variant="hero" size="lg" className="group capitalize" asChild>
            <a
              href={primaryButton.url}
              target={primaryButton.isExternal ? "_blank" : undefined}
              rel={primaryButton.isExternal ? "noopener noreferrer" : undefined}
            >
              {primaryButton.label}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        )}
        {secondaryButton && (
          <Button
            variant="hero-outline"
            size="lg"
            className="capitalize"
            asChild
          >
            <a
              href={secondaryButton.url}
              target={secondaryButton.isExternal ? "_blank" : undefined}
              rel={
                secondaryButton.isExternal ? "noopener noreferrer" : undefined
              }
            >
              {secondaryButton.label}
            </a>
          </Button>
        )}
      </div>
    );
  }
);

CTAButtons.displayName = "CTAButtons";

const StatItem = memo<{ stat: StrapiStat }>(({ stat }) => (
  <div className="flex flex-col">
    <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
    <div className="text-xs text-muted-foreground capitalize">{stat.label}</div>
  </div>
));

StatItem.displayName = "StatItem";

const StatsGrid = memo(({ stats }: { stats: StrapiStat[] }) => {
  if (!stats || stats.length === 0) return null;

  // Sort stats by order (1 is first, 2 is second, etc.)
  // Treat 0 as last if it exists
  const sortedStats = [...stats].sort((a, b) => {
    const orderA = a.order === 0 ? 999 : a.order;
    const orderB = b.order === 0 ? 999 : b.order;
    return orderA - orderB;
  });

  return (
    <div className="hidden lg:grid grid-cols-3 gap-6">
      {sortedStats.map((stat) => (
        <StatItem key={stat.id} stat={stat} />
      ))}
    </div>
  );
});

StatsGrid.displayName = "StatsGrid";

const ProductCard = memo<{ product: StrapiProduct; index: number }>(
  ({ product, index }) => {
    const Icon = getIconForProduct(product);
    const animationDelay = 0.8 + index * 0.1;

    return (
      <a
        href={`/products?category=${encodeURIComponent(product.name)}`}
        className="group relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-500 hover-glow cursor-pointer block"
      >
        {/* Product Image */}
        <div className="relative h-32 lg:h-36 overflow-hidden">
          {product.image?.url ? (
            <img
              src={product.image.url}
              alt={product.image.alternativeText || product.name}
              width={product.image.width || 400}
              height={product.image.height || 300}
              loading={index < 3 ? "eager" : "lazy"}
              fetchPriority={index < 3 ? "high" : "auto"}
              decoding="async"
              crossOrigin="anonymous"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Icon className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-60" />

          {/* Badge */}
          {product.badge && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border-0 text-xs px-2 py-0.5">
              {product.badge}
            </Badge>
          )}

          {/* Icon */}
          <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h2 className="text-base font-bold mb-0.5 group-hover:text-gradient transition-all duration-300">
            {product.name}
          </h2>
          <p className="text-xs text-muted-foreground">{product.description}</p>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10 blur-xl" />
        </div>
      </a>
    );
  }
);

ProductCard.displayName = "ProductCard";

const ProductsShowcase = memo(({ products }: { products: StrapiProduct[] }) => {
  if (!products || products.length === 0) return null;

  // Sort products by order (1 is first, 2 is second, etc.)
  // Treat 0 as last if it exists
  const sortedProducts = [...products].sort((a, b) => {
    const orderA = a.order === 0 ? 999 : a.order;
    const orderB = b.order === 0 ? 999 : b.order;
    return orderA - orderB;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {sortedProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
});

ProductsShowcase.displayName = "ProductsShowcase";

// Main component
const HeroSection = (props: ProcessedHeroSection) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <BackgroundLayer backgroundImage={props.backgroundImage} />

      {/* Content */}
      <div className="container mx-auto px-6 z-10 pt-5 xlg:pt-0">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="max-w-2xl">
            <HeroBadge badgeText={props.badgeText} />
            <HeroHeading
              mainHeading={props.mainHeading}
              highlightedText={props.highlightedText}
              subtitle={props.subtitle}
            />
            <CTAButtons
              primaryButton={props.primaryButton}
              secondaryButton={props.secondaryButton}
            />
            <StatsGrid stats={props.stats} />
          </div>

          {/* Right Column - Products Showcase */}
          <ProductsShowcase products={props.showcaseProducts} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

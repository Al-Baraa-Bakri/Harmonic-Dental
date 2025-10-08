import { memo } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Sparkles, Crown, Box, Layers, Gem, Smile, Braces, type LucideIcon } from "lucide-react";
import heroImage from "@/assets/dental-lab-hero.png";
import crownImage from "@/assets/product-crown.png";
import bridgeImage from "@/assets/product-bridge.png";
import implantImage from "@/assets/product-implant.png";
import veneerImage from "@/assets/product-veneer.png";
import dentureImage from "@/assets/product-denture.png";
import orthodonticsImage from "@/assets/product-orthodontics.png";

// Types
type ImageMetadata = {
  src: string;
  width: number;
  height: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  image: string | ImageMetadata;
  icon: LucideIcon;
  badge?: string;
};

type Stat = {
  value: string;
  label: string;
  delay: number;
};

// Constants
const PRODUCTS: Product[] = [
  {
    id: "crowns",
    title: "Crowns",
    description: "Premium ceramic & zirconia",
    image: crownImage,
    icon: Crown,
    badge: "Popular",
  },
  {
    id: "bridges",
    title: "Bridges",
    description: "Custom-designed solutions",
    image: bridgeImage,
    icon: Layers,
  },
  {
    id: "implants",
    title: "Implants",
    description: "High-precision titanium",
    image: implantImage,
    icon: Box,
    badge: "Advanced",
  },
  {
    id: "veneers",
    title: "Veneers",
    description: "Ultra-thin porcelain",
    image: veneerImage,
    icon: Gem,
  },
  {
    id: "dentures",
    title: "Dentures",
    description: "Full & partial solutions",
    image: dentureImage,
    icon: Smile,
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    description: "Aligners & appliances",
    image: orthodonticsImage,
    icon: Braces,
    badge: "New",
  },
];

const STATS: Stat[] = [
  { value: "15+", label: "Years Excellence", delay: 1.2 },
  { value: "24h", label: "Express Service", delay: 1.4 },
  { value: "99.9%", label: "Quality Rate", delay: 1.6 },
];

// Utility functions
const getAnimationStyle = (fadeDelay: number, scaleDelay?: number) => ({
  animation: `fade-in 0.6s ease-out ${fadeDelay}s both${
    scaleDelay ? `, scale-in 0.4s ease-out ${scaleDelay}s both` : ""
  }`,
});

const getImageSrc = (image: string | ImageMetadata): string => {
  return typeof image === "string" ? image : image.src;
};

// Memoized sub-components
const BackgroundLayer = memo(() => (
  <>
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageSrc(heroImage)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/98 to-background/90" />
    </div>

    {/* Animated glow orbs */}
    <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] animate-pulse delay-1000" />

    {/* Decorative grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
  </>
));

BackgroundLayer.displayName = "BackgroundLayer";

const HeroBadge = memo(() => (
  <div 
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
    style={getAnimationStyle(0.2, 0.2)}
  >
    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
    <span className="text-sm text-foreground/90">Precision Dental Solutions</span>
  </div>
));

HeroBadge.displayName = "HeroBadge";

const HeroHeading = memo(() => (
  <>
    <h1 
      className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
      style={getAnimationStyle(0.4)}
    >
      Crafting Perfect
      <span 
        className="block text-gradient mt-2" 
        style={getAnimationStyle(0.6)}
      >
        Dental Prosthetics
      </span>
    </h1>

    <p 
      className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
      style={getAnimationStyle(0.8)}
    >
      State-of-the-art laboratory delivering precision-engineered dental solutions with unmatched quality and speed.
    </p>
  </>
));

HeroHeading.displayName = "HeroHeading";

const CTAButtons = memo(() => (
  <div 
    className="flex flex-col sm:flex-row gap-4 mb-12"
    style={getAnimationStyle(1, 1)}
  >
    <Button variant="hero" size="lg" className="group">
      Contact us
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Button>
    <Button variant="hero-outline" size="lg">
      View Our Work
    </Button>
  </div>
));

CTAButtons.displayName = "CTAButtons";

const StatItem = memo<{ stat: Stat }>(({ stat }) => (
  <div 
    className="flex flex-col"
    style={getAnimationStyle(stat.delay, stat.delay)}
  >
    <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
    <div className="text-xs text-muted-foreground">{stat.label}</div>
  </div>
));

StatItem.displayName = "StatItem";

const StatsGrid = memo(() => (
  <div className="grid grid-cols-3 gap-6">
    {STATS.map((stat) => (
      <StatItem key={stat.label} stat={stat} />
    ))}
  </div>
));

StatsGrid.displayName = "StatsGrid";

const ProductCard = memo<{ product: Product; index: number }>(
  ({ product, index }) => {
    const Icon = product.icon;
    const animationDelay = 0.8 + index * 0.1;
    const imageSrc = getImageSrc(product.image);

    return (
      <div
        className="group relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-500 hover-glow cursor-pointer"
        style={getAnimationStyle(animationDelay, animationDelay)}
      >
        {/* Product Image */}
        <div className="relative h-32 lg:h-36 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-90" />
          
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
          <h3 className="text-base font-bold mb-0.5 group-hover:text-gradient transition-all duration-300">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10 blur-xl" />
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

const ProductsShowcase = memo(() => (
  <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
    {PRODUCTS.map((product, index) => (
      <ProductCard key={product.id} product={product} index={index} />
    ))}
  </div>
));

ProductsShowcase.displayName = "ProductsShowcase";

// Main component
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <BackgroundLayer />

      {/* Content */}
      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="max-w-2xl">
            <HeroBadge />
            <HeroHeading />
            <CTAButtons />
            <StatsGrid />
          </div>

          {/* Right Column - Products Showcase */}
          <ProductsShowcase />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
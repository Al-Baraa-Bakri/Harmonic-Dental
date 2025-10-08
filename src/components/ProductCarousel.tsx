import { useCallback, useEffect, useState, useRef, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Crown, Layers, Box, Gem, Smile, Braces } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  features: string[];
};

// Constants
const PRODUCTS: Product[] = [
  {
    id: "crowns",
    title: "Premium Crowns",
    description: "High-strength ceramic and zirconia crowns designed for maximum durability and natural aesthetics. Perfect shade matching and precision fit guaranteed.",
    image: crownImage,
    icon: Crown,
    features: ["Zirconia & Ceramic", "Natural Look", "10-Year Warranty"],
  },
  {
    id: "bridges",
    title: "Custom Bridges",
    description: "Expertly crafted bridge solutions that restore function and beauty. Multi-unit capabilities with advanced bonding techniques for lasting results.",
    image: bridgeImage,
    icon: Layers,
    features: ["Multi-Unit", "CAD/CAM Design", "Precision Fit"],
  },
  {
    id: "implants",
    title: "Dental Implants",
    description: "Premium titanium implant solutions engineered for superior osseointegration. Complete from abutment to crown with perfect biological integration.",
    image: implantImage,
    icon: Box,
    features: ["Titanium Grade 5", "Perfect Integration", "24h Service"],
  },
  {
    id: "veneers",
    title: "Porcelain Veneers",
    description: "Ultra-thin porcelain veneers that transform smiles with minimal preparation. Exceptional translucency and stain-resistant properties.",
    image: veneerImage,
    icon: Gem,
    features: ["Ultra-Thin", "Stain Resistant", "Natural Translucency"],
  },
  {
    id: "dentures",
    title: "Complete Dentures",
    description: "Full and partial denture solutions combining comfort with functionality. Advanced materials for superior retention and natural appearance.",
    image: dentureImage,
    icon: Smile,
    features: ["Full & Partial", "Comfortable Fit", "Natural Appearance"],
  },
  {
    id: "orthodontics",
    title: "Orthodontic Solutions",
    description: "Modern orthodontic appliances including clear aligners and fixed appliances. Precise planning with 3D digital workflow for optimal results.",
    image: orthodonticsImage,
    icon: Braces,
    features: ["Clear Aligners", "3D Planning", "Fixed Appliances"],
  },
];

const AUTOPLAY_DELAY = 4000;

// Utility function
const getImageSrc = (image: string | ImageMetadata): string => {
  if (typeof image === "string") {
    return image;
  }
  return image.src;
};

// Styles
const carouselStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scale-in {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }
`;

// Memoized Product Card
const ProductCard = memo<{ 
  product: Product; 
  index: number; 
  isActive: boolean;
}>(({ product, index, isActive }) => {
  const Icon = product.icon;
  const imageSrc = getImageSrc(product.image);

  return (
    <div className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_55%] min-w-0 pl-3 md:pl-6">
      <div className={`relative transition-all duration-700 ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-60"
      }`}>
        <div className="relative bg-card border-2 border-primary/20 rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-500">
          <div className="relative h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px] overflow-hidden bg-muted">
            <img
              src={imageSrc}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${imageSrc}`);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
            
            <div className="absolute top-3 left-3 md:top-4 md:left-4 w-9 h-9 md:w-12 md:h-12 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </div>

            <div className="absolute top-3 right-3 md:top-4 md:right-4 text-4xl md:text-6xl font-bold text-primary/10 select-none">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          <div className="relative p-4 sm:p-5 md:p-6 lg:p-7">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 group-hover:text-gradient transition-all duration-300">
              {product.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3 md:mb-4 text-xs sm:text-sm lg:text-base line-clamp-2 md:line-clamp-3">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="px-2 sm:px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs text-foreground/90 hover:bg-primary/20 transition-colors duration-300"
                >
                  {feature}
                </div>
              ))}
            </div>

            <div className="absolute -bottom-16 -right-16 w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors duration-700" />
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10 blur-lg" />
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

// Main Component
const ProductCarousel = () => {
  const autoplayRef = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplayRef.current]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      autoplayRef.current.reset();
    }
  }, []);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("pointerDown", resetAutoplay);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", resetAutoplay);
    };
  }, [emblaApi, onSelect, resetAutoplay]);

  return (
    <>
      <style>{carouselStyles}</style>
      
      <section className="py-10 md:py-16 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-background to-card/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10 lg:mb-12">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
              style={{ animation: "fade-in 0.6s ease-out 0.2s both, scale-in 0.4s ease-out 0.2s both" }}
            >
              <Box className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-foreground/90">Our Products</span>
            </div>
            <h2 
              className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4"
              style={{ animation: "fade-in 0.8s ease-out 0.4s both" }}
            >
              Precision-Crafted
              <span className="block text-gradient mt-1">Dental Solutions</span>
            </h2>
            <p 
              className="text-sm md:text-base text-muted-foreground"
              style={{ animation: "fade-in 0.8s ease-out 0.6s both" }}
            >
              Explore our comprehensive range of dental prosthetics, each crafted with meticulous attention to detail.
            </p>
          </div>

          <div 
            className="relative"
            style={{ animation: "fade-in 0.8s ease-out 0.8s both, scale-in 0.4s ease-out 0.8s both" }}
          >
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-3 md:gap-4">
                {PRODUCTS.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isActive={index === selectedIndex}
                  />
                ))}
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-4 pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="pointer-events-auto w-8 h-8 md:w-10 md:h-10 rounded-full bg-card/80 backdrop-blur-md border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="pointer-events-auto w-8 h-8 md:w-10 md:h-10 rounded-full bg-card/80 backdrop-blur-md border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>

            <div className="flex justify-center gap-1.5 mt-5 md:mt-6">
              {PRODUCTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCarousel;
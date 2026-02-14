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
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type {
  ProcessedTechnologyItem,
  ProcessedTechnologyPage,
} from "@/lib/api/technology-page";
import { getStrapiURL } from "@/lib/strapi";

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

// Technologies per page constant
const TECHNOLOGIES_PER_PAGE = 6;

// Image Carousel Component
const ImageCarousel = ({
  images,
  altText,
  index = 0,
}: {
  images: any[];
  altText: string;
  index?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Embla Carousel setup with smooth snapping
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    []
  );

  // Update current index when carousel scrolls
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // Set initial index

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="relative h-full group/carousel">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {images.map((image: any, idx: number) => {
            const imageUrl = image?.url ? getStrapiURL(image.url) || '' : '';

            return (
              <div
                key={idx}
                className="embla__slide flex-[0_0_100%] min-w-0 h-full relative"
              >
                <img
                  src={imageUrl}
                  alt={image?.alternativeText || altText}
                  width={image?.width || 600}
                  height={image?.height || 400}
                  loading={index < 2 && idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 && idx === 0 ? "high" : "auto"}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  style={{
                    contentVisibility: 'auto',
                    willChange: 'transform',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent pointer-events-none" />

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card shadow-lg z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-card shadow-lg z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (emblaApi) {
                    emblaApi.scrollTo(idx);
                  }
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-primary w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Technology Card Component
const TechnologyCard = ({
  item,
  index,
  onOpenDetails,
}: {
  item: ProcessedTechnologyItem;
  index: number;
  onOpenDetails: () => void;
}) => {
  const Icon = getIconForTechnology(item);
  const images = Array.isArray(item.images) ? item.images : [item.images].filter(Boolean);
  const displayFeatures = item.features.slice(0, 2);

  return (
    <div
      className="group relative animate-fade-in max-w-[380px] md:max-w-fit"
    >
      {/* Card */}
      <div className="relative h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover-glow flex flex-col cursor-pointer"
      onClick={onOpenDetails}
      >
        {/* Image/Video Section with Carousel */}
        <div className="relative h-64 md:h-80 2xl:h-96 overflow-hidden bg-muted">
          {images.length > 0 ? (
            <>
              <ImageCarousel images={images} altText={item.name} index={index} />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="w-20 h-20 text-muted-foreground/20" />
            </div>
          )}

          {/* Badge */}
          {item.badge && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 z-10">
              {item.badge}
            </Badge>
          )}

          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-4 right-4 z-10">
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
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                <Play
                  className="w-7 h-7 text-primary-foreground ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
          )}

          {/* Icon Badge */}
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 group-hover:scale-110 transition-transform duration-300 shadow-lg z-10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
            {item.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
            {item.description}
          </p>

          {/* Top 2 Features */}
          {displayFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {displayFeatures.map((feature: any) => (
                <div
                  key={feature.id}
                  className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground/90"
                >
                  {feature.name}
                </div>
              ))}
            </div>
          )}

          {/* View Details Button */}
          <Button
            onClick={onOpenDetails}
            variant="outline"
            className="w-full group/btn border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <span>View Details</span>
            <Sparkles className="w-4 h-4 ml-2 group-hover/btn:rotate-12 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Technology Details Modal
const TechnologyDetailsModal = ({
  item,
  isOpen,
  onClose,
}: {
  item: ProcessedTechnologyItem | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [showExpandButton, setShowExpandButton] = useState(false);

  // Get images array (safe even if item is null)
  const images = item ? (Array.isArray(item.images) ? item.images : [item.images].filter(Boolean)) : [];

  // Embla Carousel setup with smooth snapping
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    []
  );

  // Update current index when carousel scrolls
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // Set initial index

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Reset carousel when item changes or modal opens
  useEffect(() => {
    if (emblaApi && item && isOpen) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
      setCurrentImageIndex(0);
    }
  }, [emblaApi, item?.id, isOpen]);

  const nextImage = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const prevImage = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  // Reset when item changes or modal opens
  useEffect(() => {
    if (item && isOpen) {
      setCurrentImageIndex(0);
      setIsDescriptionExpanded(false);
    }
  }, [item?.id, isOpen]);

  // Check height whenever modal opens or content changes
  useEffect(() => {
    if (!item?.detailedDescription || !descriptionRef.current) {
      setShowExpandButton(false);
      return;
    }

    const checkHeight = () => {
      const element = descriptionRef.current;
      if (!element) return;

      // Temporarily override max-height with inline style to measure true height
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      
      const height = element.scrollHeight;
      setShowExpandButton(height > 96);
      
      // Restore original styles
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;
    };

    const timer = setTimeout(checkHeight, 150);
    return () => clearTimeout(timer);
  }, [item?.detailedDescription, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prevImage, nextImage]);

  if (!item) return null;

  const Icon = getIconForTechnology(item);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 w-[95vw] sm:w-full m-0 sm:m-4 rounded-none sm:rounded-lg">
        <div className="relative">
          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
            {images.length > 0 ? (
              <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                  {images.map((image: any, idx: number) => {
                    const imageUrl = image?.url ? getStrapiURL(image.url) || '' : '';
                    
                    return (
                      <div
                        key={idx}
                        className="embla__slide flex-[0_0_100%] min-w-0 h-full relative"
                      >
                        <img
                          src={imageUrl}
                          alt={image?.alternativeText || item.name}
                          width={image?.width || 600}
                          height={image?.height || 400}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          crossOrigin="anonymous"
                          className="w-full h-full object-contain"
                          style={{
                            contentVisibility: 'auto',
                            willChange: 'transform',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-32 h-32 text-primary/20" />
              </div>
            )}

            {/* Navigation for multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 hover:bg-card shadow-lg z-20 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 hover:bg-card shadow-lg z-20 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                  {images.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (emblaApi) {
                          emblaApi.scrollTo(index);
                        }
                      }}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-primary w-6 sm:w-8"
                          : "bg-white/50 hover:bg-white/80 w-1.5 sm:w-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}


            {/* Icon Badge */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center border border-primary/30 shadow-lg z-10">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 md:p-8">
            <DialogHeader className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    {item.name}
                  </DialogTitle>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.badge && (
                    <Badge className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      {item.badge}
                    </Badge>
                  )}
                  {item.featured && (
                    <Badge className="bg-accent text-accent-foreground text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Detailed Description */}
            {item.detailedDescription && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  About This Technology
                </h3>
                <div className="relative">
                  <div
                    ref={descriptionRef}
                    className={`prose prose-sm max-w-none text-muted-foreground text-sm sm:text-base transition-all duration-300 ${
                      !isDescriptionExpanded && showExpandButton ? "max-h-[96px] overflow-hidden" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: item.detailedDescription,
                    }}
                  />
                  {!isDescriptionExpanded && showExpandButton && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  )}
                  {showExpandButton && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Show Less
                          <ChevronLeft className="w-4 h-4 rotate-90" />
                        </>
                      ) : (
                        <>
                          Show More
                          <ChevronRight className="w-4 h-4 rotate-90" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* All Features */}
            {item.features.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  Key Features & Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                  {item.features.map((feature: any) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm">{feature.name}</p>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {item.videoUrl && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  Watch in Action
                </h3>
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-black aspect-video">
                  <iframe
                    src={item.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-border">
              <Button 
                className="flex-1 group text-sm sm:text-base" 
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  // Small delay to allow modal to close before navigation
                  setTimeout(() => {
                    window.location.href = '#contact-us';
                  }, 100);
                }}
              >
                Get Started
                <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-sm sm:text-base"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  // Small delay to allow modal to close before navigation
                  setTimeout(() => {
                    window.location.href = '/products';
                  }, 100);
                }}
              >
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TechnologyPage = ({
  heroTitle = "The Newest",
  heroHighlightedText = "Technology",
  heroSubtitle = "Explore cutting-edge dental technology that transforms precision and efficiency in every restoration.",
  backButtonText = "Back to Home",
  technologyItems = [],
}: ProcessedTechnologyPage) => {
  const [selectedTechnology, setSelectedTechnology] =
    useState<ProcessedTechnologyItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate technologies
  const paginatedTechnologies = useMemo(() => {
    const startIndex = (currentPage - 1) * TECHNOLOGIES_PER_PAGE;
    return technologyItems.slice(startIndex, startIndex + TECHNOLOGIES_PER_PAGE);
  }, [technologyItems, currentPage]);

  const totalPages = Math.ceil(technologyItems.length / TECHNOLOGIES_PER_PAGE);

  // Memoize modal handlers
  const handleOpenDetails = useCallback((item: ProcessedTechnologyItem) => {
    setSelectedTechnology(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTechnology(null), 300);
  }, []);

  // Memoize pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalPages]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          {/* Results count */}
          {technologyItems.length > 0 && (
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {paginatedTechnologies.length} of {technologyItems.length}{" "}
              technologies
            </div>
          )}

          {technologyItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No technologies available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                {paginatedTechnologies.map((item: any, index: any) => (
                  <TechnologyCard
                    key={item.id}
                    item={item}
                    index={index}
                    onOpenDetails={() => handleOpenDetails(item)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, idx, array) => {
                          const prevPage = array[idx - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => handlePageClick(page)}
                                className="w-10 h-10"
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Technology Details Modal */}
      <TechnologyDetailsModal
        item={selectedTechnology}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Bottom CTA */}
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
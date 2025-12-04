import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Box,
  ArrowLeft,
  X,
  Crown,
  Layers,
  Gem,
  Smile,
  Braces,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

// Icon mapping by category slug or name
const ICON_MAP: Record<string, LucideIcon> = {
  // By slug
  crowns: Crown,
  crown: Crown,
  bridges: Layers,
  bridge: Layers,
  implants: Box,
  implant: Box,
  veneers: Gem,
  veneer: Gem,
  dentures: Smile,
  denture: Smile,
  orthodontics: Braces,
  orthodontic: Braces,
};

// Helper to get icon for category
const getIconForCategory = (categorySlug?: string): LucideIcon => {
  if (!categorySlug) return Box;
  const slug = categorySlug.toLowerCase();
  return ICON_MAP[slug] || Box;
};

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Products per page constant
const PRODUCTS_PER_PAGE = 9;

const ProductsPage = ({
  heroTitle = "Our",
  heroHighlightedText = "Products",
  heroSubtitle = "Explore our comprehensive range of precision-crafted dental prosthetics, each designed to meet the highest standards of quality and aesthetics.",
  backButtonText = "Back to Home",
  productTypes = [],
  categories = [],
}: any) => {
  // Get initial category from URL parameter
  const getInitialCategory = () => {
    if (typeof window === "undefined") return "all";
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "all";
  };

  const [selectedCategorySlug, setSelectedCategorySlug] =
    useState<string>(getInitialCategory);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced URL update
  const updateURL = useMemo(
    () =>
      debounce((slug: string) => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        if (slug === "all") {
          url.searchParams.delete("category");
        } else {
          url.searchParams.set("category", slug);
        }
        window.history.replaceState({}, "", url);
      }, 300),
    []
  );

  // Update URL when category changes
  useEffect(() => {
    updateURL(selectedCategorySlug);
  }, [selectedCategorySlug, updateURL]);

  // Listen for URL changes (browser back/forward)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setSelectedCategorySlug(getInitialCategory());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return selectedCategorySlug === "all"
      ? productTypes
      : productTypes.filter(
          (product: any) =>
            product.category?.name?.toLowerCase() ===
            selectedCategorySlug.toLowerCase()
        );
  }, [selectedCategorySlug, productTypes]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategorySlug]);

  // Memoize toggle handler
  const handleToggleModel = useCallback((productId: string) => {
    setActiveModelId((prev) => (prev === productId ? null : productId));
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: productTypes.map((product: any, index: number) => ({
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image?.url,
      sku: product.id,
      mpn: product.id,
      brand: {
        "@type": "Brand",
        name: "Harmonic Dental",
      },
      offers: {
        "@type": "Offer",
        url: `https://www.harmonicdental.com/products`,
        priceCurrency: "USD",
        price: product.price || "0",
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Harmonic Dental",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{backButtonText}</span>
          </a>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {heroTitle}{" "}
            <span className="text-gradient">{heroHighlightedText}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Filter Section */}
      {categories.length > 0 && (
        <section className="py-2 md:py-8 border-b border-border/50 bg-card/30 sticky top-20 z-40 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-nowrap overflow-x-auto gap-2 md:gap-3">
              <Button
                variant={selectedCategorySlug === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategorySlug("all")}
                className="text-sm mb-3"
              >
                All Products
              </Button>
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategorySlug.toLowerCase() ===
                    category.name.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setSelectedCategorySlug(category.name.toLowerCase())
                  }
                  className="text-sm mb-3"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          {/* Results count */}
          {filteredProducts.length > 0 && (
            <div className="mb-6 text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
              products
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedProducts.map((product: any, index: any) => {
              const Icon = getIconForCategory(product.category?.slug);
              const isModelActive = activeModelId === product.slug;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:border-primary/50 transition-all duration-500 hover-glow animate-fade-in"
                >
                  <a href="#contact-us">
                    {/* Product Image / 3D Model Container */}
                    <div className="relative h-64 md:h-80 2xl:h-96 overflow-hidden">
                      {/* Original Image */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isModelActive
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        {product.image?.url ? (
                          <>
                            <img
                              src={product.image.url}
                              alt={
                                product.image.alternativeText || product.name
                              }
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-muted"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Icon className="w-20 h-20 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      {/* 3D Model Viewer (placeholder - implement when needed) */}
                      {product.model3dUrl && (
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 bg-muted flex items-center justify-center ${
                            isModelActive
                              ? "opacity-100"
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          <p className="text-muted-foreground text-sm">
                            3D Model View
                          </p>
                          {/* TODO: Integrate 3D viewer library here */}
                        </div>
                      )}

                      {/* Badge */}
                      {product.badge && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 z-10">
                          {product.badge}
                        </Badge>
                      )}

                      {/* Stock Status */}
                      {!product.inStock && (
                        <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground border-0 z-10">
                          Out of Stock
                        </Badge>
                      )}

                      {/* Close Button (when 3D is active) */}
                      {isModelActive && (
                        <button
                          onClick={() => handleToggleModel(product.slug)}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border border-border hover:bg-background transition-colors flex items-center justify-center z-20"
                          aria-label="Close 3D view"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}

                      {/* Category (only show when not in 3D mode) */}
                      {!isModelActive && product.category && (
                        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-secondary border-0 z-10">
                          <span className="text-xs text-black">
                            {product.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-gradient transition-all duration-300">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features */}
                      {product.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature: any) => (
                            <div
                              key={feature.id}
                              className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground/90"
                            >
                              {feature.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Price (if available) */}
                      {product.price && (
                        <div className="text-lg font-semibold text-primary">
                          ${product.price.toFixed(2)}
                        </div>
                      )}

                      {/* 3D View Button */}
                      {product.model3dUrl && (
                        <Button
                          variant={isModelActive ? "default" : "outline"}
                          className="w-full gap-2 group/btn"
                          onClick={() => handleToggleModel(product.slug)}
                        >
                          <Box className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                          {isModelActive ? "Back to Image" : "View in 3D"}
                        </Button>
                      )}
                    </CardContent>
                  </a>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                {productTypes.length === 0
                  ? "No products available yet."
                  : "No products found in this category."}
              </p>
            </div>
          )}

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
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
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
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;

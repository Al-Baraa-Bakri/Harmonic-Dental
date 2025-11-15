import { useState } from "react";
import { products, categories } from "@/data/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, ArrowLeft, X } from "lucide-react";
import { getImageSrc } from "@/lib/utils";
import ModelViewer from "@/components/ModelViewer";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleToggleModel = (productId: string) => {
    setActiveModelId(activeModelId === productId ? null : productId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </a>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Our <span className="text-gradient">Products</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Explore our comprehensive range of precision-crafted dental prosthetics, each designed to meet the highest standards of quality and aesthetics.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-border/50 bg-card/30 sticky top-20 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => {
              const Icon = product.icon;
              const isModelActive = activeModelId === product.id;
              
              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:border-primary/50 transition-all duration-500 hover-glow"
                  style={{ animation: `fade-in 0.5s ease-out ${index * 0.1}s both` }}
                >
                  {/* Product Image / 3D Model Container */}
                  <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                    {/* Original Image */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isModelActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      <img
                        src={getImageSrc(product.image)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>

                    {/* 3D Model Viewer */}
                    {product.model && (
                      <div 
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isModelActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <ModelViewer
                          src={product.model}
                          alt={`3D model of ${product.title}`}
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center z-10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground border-0 z-10">
                        {product.badge}
                      </Badge>
                    )}

                    {/* Close Button (when 3D is active) */}
                    {isModelActive && (
                      <button
                        onClick={() => handleToggleModel(product.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border border-border hover:bg-background transition-colors flex items-center justify-center z-20"
                        aria-label="Close 3D view"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    {/* Category (only show when not in 3D mode) */}
                    {!isModelActive && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 z-10">
                        <span className="text-xs text-foreground/90">{product.category}</span>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-gradient transition-all duration-300">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature) => (
                        <div
                          key={feature}
                          className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground/90"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 3D View Button */}
                    {product.model && (
                      <Button 
                        variant={isModelActive ? "default" : "outline"}
                        className="w-full gap-2 group/btn"
                        onClick={() => handleToggleModel(product.id)}
                      >
                        <Box className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                        {isModelActive ? "Back to Image" : "View in 3D"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
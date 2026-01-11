import { useState, useRef, useCallback, useEffect } from "react";

const BeforeAfterSection = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // centralized logic to calculate position
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Mouse/Touch Move handlers attached to WINDOW
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevents selection artifacts
      calculatePosition(e.clientX);
    },
    [isDragging, calculatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      calculatePosition(e.touches[0].clientX);
    },
    [isDragging, calculatePosition]
  );

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach global listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchend", handleInteractionEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchend", handleInteractionEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  // Initial interaction start
  const handleInteractionStart = (
    e: React.MouseEvent | React.TouchEvent,
    clientX: number
  ) => {
    setIsDragging(true);
    calculatePosition(clientX);
  };

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4 animate-fade-in">
            Quality Comparison
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            See the <span className="text-primary">Difference</span>
          </h2>
          <p
            className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Drag the slider to compare our precision craftsmanship with standard
            dental work
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize shadow-2xl border border-border/50 animate-scale-in select-none touch-none"
            style={{ animationDelay: "0.3s" }}
            onMouseDown={(e) => handleInteractionStart(e, e.clientX)}
            onTouchStart={(e) =>
              handleInteractionStart(e, e.touches[0].clientX)
            }
          >
            {/* Before Image (Full width, underneath) */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="/before.webp"
                alt="Before - Standard dental work"
                width="1600"
                height="1000"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <span className="absolute bottom-6 left-6 px-4 py-2 bg-muted/90 backdrop-blur-sm rounded-lg text-foreground font-semibold text-sm border border-border/50">
                BEFORE
              </span>
            </div>

            {/* After Image (Clipped based on slider) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src="/after.webp"
                alt="After - Denta precision craftsmanship"
                width="1600"
                height="1000"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <span className="absolute bottom-6 right-6 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-lg text-primary-foreground font-semibold text-sm">
                AFTER
              </span>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg shadow-primary/50 transition-shadow"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* Handle Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-background pointer-events-none">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                  </svg>
                </div>
              </div>

              {/* Vertical Line Glow */}
              <div className="absolute inset-0 w-1 bg-primary blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;

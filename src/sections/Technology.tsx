import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  Scan,
  Cpu,
  Cog,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type StrapiProcessStep = {
  id: number;
  number: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  };
  order: number;
};

// Icon mapping by step order/number
const ICON_MAP: LucideIcon[] = [Scan, Cpu, Cog, CheckCircle2];

// Color mapping by step order - Brand "Harmonic Green" theme (Hue 152)
const COLOR_MAP = [
  {
    color: "from-[hsl(152,85%,42%)]/20 to-[hsl(152,85%,50%)]/20",
    gradientFrom: "from-[hsl(152,85%,42%)]",
    gradientTo: "to-[hsl(152,85%,50%)]",
  },
  {
    color: "from-[hsl(170,75%,42%)]/20 to-[hsl(180,75%,45%)]/20",
    gradientFrom: "from-[hsl(170,75%,42%)]",
    gradientTo: "to-[hsl(180,75%,45%)]",
  },
  {
    color: "from-[hsl(140,70%,45%)]/20 to-[hsl(152,80%,48%)]/20",
    gradientFrom: "from-[hsl(140,70%,45%)]",
    gradientTo: "to-[hsl(152,80%,48%)]",
  },
  {
    color: "from-[hsl(160,80%,40%)]/20 to-[hsl(170,80%,45%)]/20",
    gradientFrom: "from-[hsl(160,80%,40%)]",
    gradientTo: "to-[hsl(170,80%,45%)]",
  },
];

// Helper functions (memoized)
const getIconForStep = (index: number): LucideIcon => ICON_MAP[index] || Scan;
const getColorsForStep = (index: number) => COLOR_MAP[index] || COLOR_MAP[0];
const getPosition = (index: number): "left" | "right" =>
  index % 2 === 0 ? "right" : "left";

// Optimized styles with reduced animations
const sectionStyles = `
  @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { transform: scale(0.95); } to { transform: scale(1); } }
  @keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  .tech-badge { animation: fade-in 0.6s ease-out 0.2s both; }
  .tech-heading { animation: fade-in 0.8s ease-out 0.4s both; }
  .tech-description { animation: fade-in 0.8s ease-out 0.6s both; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

// Hook to detect mobile devices - SSR safe
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Return false during SSR and initial render to match server
  return isClient ? isMobile : false;
};

/**
 * Optimized CurvedPath - hidden on mobile with CSS
 */
const CurvedPath = ({
  pathProgress,
}: {
  pathProgress: MotionValue<number>;
}) => {
  const PATH_D =
    "M 150 100 C 250 200, 50 300, 150 450 C 250 600, 50 700, 150 900 C 250 1050, 50 1150, 150 1300";

  const strokeDashoffset = useTransform(pathProgress, [0, 1], [2000, 0]);

  // Use CSS to hide on mobile (prevents hydration issues)
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-full max-w-md pointer-events-none hidden md:block">
      <svg
        className="w-full h-full"
        viewBox="0 0 300 1400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Static background path */}
        <path
          d={PATH_D}
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 8"
        />
        {/* Animated path */}
        <motion.path
          d={PATH_D}
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
          strokeDasharray={2000}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))",
            willChange: "stroke-dashoffset",
          }}
        />
      </svg>
    </div>
  );
};

/**
 * Optimized ProcessStepCard with reduced transforms on mobile
 */
const ProcessStepCard = ({
  step,
  index,
  totalSteps,
  pathProgress,
  isMobile,
}: {
  step: StrapiProcessStep;
  index: number;
  totalSteps: number;
  pathProgress: MotionValue<number>;
  isMobile: boolean;
}) => {
  const Icon = useMemo(() => getIconForStep(index), [index]);
  const colors = useMemo(() => getColorsForStep(index), [index]);
  const position = useMemo(() => getPosition(index), [index]);

  // Calculate thresholds - only used for desktop
  const threshold = useMemo(
    () => (index + 1) / (totalSteps + 1) - 0.1,
    [index, totalSteps]
  );
  const lower = useMemo(() => Math.max(0, threshold - 0.72), [threshold]);

  // ALWAYS call all hooks at top level (Rules of Hooks)
  const reveal = useTransform(
    pathProgress,
    [0, lower, threshold, 1],
    [0, 0, 1, 1]
  );

  // Always calculate all transforms (even if not used on mobile)
  const scale = useTransform(reveal, [0, 1], [0.95, 1]);
  const rotate = useTransform(
    reveal,
    [0, 1],
    [position === "left" ? -6 : 6, 0]
  );
  const x = useTransform(reveal, [0, 1], [position === "left" ? -60 : 60, 0]);
  const y = useTransform(reveal, [0, 1], [20, 0]); // For mobile
  const beamScaleX = useTransform(reveal, [0, 1], [0, 1]);
  const dotScale = useTransform(reveal, [0, 1], [0.8, 1]);

  // Decide which animation props to use based on isMobile
  const animationProps = useMemo(() => {
    // Both mobile and desktop now use scroll-based animations
    // Mobile uses simpler transforms for better performance
    if (isMobile) {
      return {
        style: {
          opacity: reveal,
          y: y,
          willChange: "transform, opacity",
        },
      };
    }

    // Desktop: full scroll-based animations
    return {
      style: {
        opacity: reveal,
        scale,
        rotate,
        x,
        willChange: "transform, opacity",
      },
    };
  }, [isMobile, reveal, scale, rotate, x, y]);

  return (
    <div className="relative flex items-center justify-center min-h-[350px] md:min-h-[400px] py-6">
      {/* Dot on path - desktop only using CSS */}
      <motion.div
        style={{
          opacity: reveal,
          scale: dotScale,
          willChange: "transform, opacity",
        }}
        className="absolute left-1/2 -translate-x-1/2 hidden md:block z-30"
      >
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-150" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg whitespace-nowrap">
            Step {step.number}
          </div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.article
        {...animationProps}
        className={`group relative w-full md:w-[300px] ${
          position === "left" ? "md:mr-[30vw] md:pr-8" : "md:ml-[30vw] md:pl-8"
        }`}
      >
        {/* Connecting beam - hidden on mobile with CSS */}
        <motion.div
          style={{
            transformOrigin:
              position === "left" ? "left center" : "right center",
            scaleX: beamScaleX,
            opacity: reveal,
            willChange: "transform",
          }}
          className={`absolute hidden md:block top-1/2 -translate-y-1/2 h-1 z-10 ${
            position === "left"
              ? "left-full w-8 bg-gradient-to-r from-primary to-transparent"
              : "right-full w-8 bg-gradient-to-l from-primary to-transparent"
          }`}
        />

        <div className="relative group/card">
          {/* Background gradient - no hover effects */}
          <div
            className={`absolute -inset-0.5 bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} rounded-3xl opacity-30 transition-opacity duration-500 blur-0 md:blur`}
          />

          <div
            className={`relative bg-card border border-primary/20 rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-none md:backdrop-blur-xl bg-card md:bg-card/95`}
          >
            {/* Image section */}
            <div className="relative h-40 overflow-hidden">
              {/* Mobile step indicator - shown only on mobile with CSS */}
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg md:hidden">
                Step {step.number}
              </div>

              {step.image?.url ? (
                <img
                  src={step.image.url}
                  alt={step.image.alternativeText || step.title}
                  width={step.image.width || 400}
                  height={step.image.height || 300}
                  loading="lazy"
                  decoding="async"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icon className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}

              <div
                className={`absolute inset-0 bg-gradient-to-br ${colors.color} mix-blend-overlay`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />

              {/* Icon badge */}
              <div className="absolute top-4 left-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.color} border-2 border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-500 backdrop-blur-none md:backdrop-blur-md`}
                >
                  <Icon className="w-7 h-7 text-primary drop-shadow-lg" />
                </div>
              </div>

              {/* Step number watermark */}
              <div className="absolute top-4 right-4 text-7xl font-black text-white/5 select-none leading-none">
                {step.number}
              </div>
            </div>

            {/* Content section */}
            <div className="p-5 relative">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Progress indicators */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= index ? "bg-primary flex-1" : "bg-primary/20 w-1"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Side accent line */}
            <div
              className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${
                colors.gradientFrom
              } ${colors.gradientTo} ${
                position === "left" ? "right-0" : "left-0"
              }`}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const TechnologySection = ({
  headerBadge = "Advanced Technology",
  headerTitle = "Your Journey to",
  headerHighlightedText = "Perfect Dental Prosthetics",
  headerSubtitle = "Follow the path from digital scan to final delivery, powered by cutting-edge technology.",
  processSteps = [],
  ctaButton,
}: any) => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll progress - only on desktop for performance
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Sort steps once
  const sortedSteps = useMemo(() => {
    return [...processSteps].sort((a, b) => {
      const orderA = a.order === 0 ? 999 : a.order;
      const orderB = b.order === 0 ? 999 : b.order;
      return orderA - orderB;
    });
  }, [processSteps]);

  return (
    <>
      <style>{sectionStyles}</style>

      <section
        ref={sectionRef}
        className="py-12 md:py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-card/30 via-background to-background"
      >
        {/* Background effects - hidden on mobile with CSS */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] hidden md:block" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] hidden md:block" />

        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-foreground/90">{headerBadge}</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
              {headerTitle}{" "}
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-1">
                {headerHighlightedText}
              </span>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground tech-description">
              {headerSubtitle}
            </p>
          </div>

          {/* Process steps */}
          {sortedSteps.length > 0 && (
            <div className="relative mb-12 md:mb-16">
              <CurvedPath pathProgress={scrollYProgress} />

              <div className="relative">
                {sortedSteps.map((step, index) => (
                  <ProcessStepCard
                    key={step.id}
                    step={step}
                    index={index}
                    totalSteps={sortedSteps.length}
                    pathProgress={scrollYProgress}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          {ctaButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <Button variant="hero" size="lg" className="group" asChild>
                <a
                  href={ctaButton.url}
                  target={ctaButton.isExternal ? "_blank" : undefined}
                  rel={ctaButton.isExternal ? "noopener noreferrer" : undefined}
                >
                  {ctaButton.label}
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default TechnologySection;

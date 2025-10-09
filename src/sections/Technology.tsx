import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Scan, Cpu, Cog, Sparkles, CheckCircle2, Zap, Microscope, Package, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import crownImage from "@/assets/product-crown.png";
import bridgeImage from "@/assets/product-bridge.png";
import implantImage from "@/assets/product-implant.png";
import veneerImage from "@/assets/product-veneer.png";

// Types
type ImageMetadata = { src: string; width: number; height: number; };

type ProcessStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  image: string | ImageMetadata;
  position: "left" | "right";
};

type Technology = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stat: string;
  statLabel: string;
};

// Data
const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "scan",
    number: "01",
    title: "Digital Scanning",
    description: "Advanced scanners capture every microscopic detail with 10-micron precision.",
    icon: Scan,
    color: "from-blue-500/20 to-cyan-500/20",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    image: crownImage,
    position: "right",
  },
  {
    id: "design",
    number: "02",
    title: "CAD Design",
    description: "Cutting-edge CAD/CAM software for perfect anatomical form.",
    icon: Cpu,
    color: "from-purple-500/20 to-pink-500/20",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    image: bridgeImage,
    position: "left",
  },
  {
    id: "manufacturing",
    number: "03",
    title: "Precision Manufacturing",
    description: "5-axis milling machines craft prosthetics with unmatched accuracy.",
    icon: Cog,
    color: "from-orange-500/20 to-red-500/20",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    image: implantImage,
    position: "right",
  },
  {
    id: "quality",
    number: "04",
    title: "Quality Control",
    description: "Multi-point inspection ensures perfect fit and integrity.",
    icon: CheckCircle2,
    color: "from-green-500/20 to-emerald-500/20",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    image: veneerImage,
    position: "left",
  },
];

const TECHNOLOGIES: Technology[] = [
  { id: "speed", title: "Lightning Fast", description: "Advanced automation workflows", icon: Zap, stat: "24h", statLabel: "Express" },
  { id: "precision", title: "Micro Precision", description: "10-micron accuracy milling", icon: Microscope, stat: "10μm", statLabel: "Tolerance" },
  { id: "quality", title: "Premium Materials", description: "FDA-approved materials", icon: Sparkles, stat: "99.9%", statLabel: "Quality" },
  { id: "delivery", title: "On-Time Delivery", description: "Secure tracked shipping", icon: Package, stat: "100%", statLabel: "On-Time" },
];

// Helpers
const getImageSrc = (image: string | ImageMetadata) => (typeof image === "string" ? image : image.src);

// Styles
const sectionStyles = `
  @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scale-in { from { transform: scale(0.95); } to { transform: scale(1); } }
  @keyframes pulse-glow {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7); }
    50% { transform: scale(1.15); box-shadow: 0 0 0 15px hsl(var(--primary) / 0); }
  }
  .tech-badge { animation: fade-in 0.6s ease-out 0.2s both, scale-in 0.4s ease-out 0.2s both; }
  .tech-heading { animation: fade-in 0.8s ease-out 0.4s both; }
  .tech-description { animation: fade-in 0.8s ease-out 0.6s both; }
  .tech-card { animation: scale-in 0.5s ease-out both; }
  .tech-card:nth-child(1) { animation-delay: 1.6s; }
  .tech-card:nth-child(2) { animation-delay: 1.7s; }
  .tech-card:nth-child(3) { animation-delay: 1.8s; }
  .tech-card:nth-child(4) { animation-delay: 1.9s; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
`;

/**
 * CurvedPath
 * - Receives the shared `pathProgress` MotionValue (0..1)
 * - strokeDashoffset is driven by that progress so the line draws as the section scrolls
 */
const CurvedPath = ({ pathProgress }: { pathProgress: MotionValue<number> }) => {
  const PATH_D = "M 150 100 C 250 200, 50 300, 150 450 C 250 600, 50 700, 150 900 C 250 1050, 50 1150, 150 1300";
  // map normalized progress -> dashoffset (2000 -> 0)
  const strokeDashoffset = useTransform(pathProgress, [0, 1], [2000, 0]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-full max-w-md pointer-events-none hidden md:block">
      <svg className="w-full h-full" viewBox="0 0 300 1400" preserveAspectRatio="xMidYMid meet">
        <path d={PATH_D} stroke="hsl(var(--primary) / 0.12)" strokeWidth="2" fill="none" strokeDasharray="8 8" />
        <motion.path
          d={PATH_D}
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
          strokeDasharray={2000}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary) / 0.6))" }}
        />
      </svg>
    </div>
  );
};

/**
 * ProcessStepCard
 * - Uses the shared `pathProgress` to compute a reveal MotionValue for this step.
 * - The reveal only becomes > 0 when the pathProgress approaches the step's threshold.
 * - This guarantees the line draws first; only when the path reaches threshold the card appears.
 */
const ProcessStepCard = ({
  step,
  index,
  pathProgress,
}: {
  step: ProcessStep;
  index: number;
  pathProgress: MotionValue<number>;
}) => {
  const Icon = step.icon;
  const imageSrc = getImageSrc(step.image);

  // threshold derived from index: spaced across the [0..1] progress of the whole path.
  // Using (index + 1)/(N + 1) spaces them nicely; tweak the offset for earlier/later reveals.
  const total = PROCESS_STEPS.length;
  const threshold = (index + 1) / (total + 1) - 0.1; // e.g. for 4 steps -> 0.2,0.4,0.6,0.8
  const lower = Math.max(0, threshold - 4.72); // start revealing a bit before threshold for a smooth effect

  // reveal: clamp to 0 before `lower`, ramp 0->1 between lower..threshold, and stay 1 afterwards
  const reveal = useTransform(pathProgress, [0, lower, threshold, 1], [0, 0, 1, 1]);

  // derive visible transforms from reveal
  const opacity = reveal;
  const scale = useTransform(reveal, [0, 1], [0.95, 1]);
  const rotate = useTransform(reveal, [0, 1], [step.position === "left" ? -6 : 6, 0]);
  const x = useTransform(reveal, [0, 1], [step.position === "left" ? -60 : 60, 0]);

  // connecting beam (from card to line) grows with reveal
  const beamScaleX = useTransform(reveal, [0, 1], [0, 1]);

  return (
    <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[400px]">
      {/* Dot on path that appears when reveal > 0 */}
      <motion.div style={{ opacity: reveal, scale }} className="absolute left-1/2 -translate-x-1/2 hidden md:block z-30">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-primary pulse-glow" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-150" />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg whitespace-nowrap">
            Step {step.number}
          </div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.article
        style={{ opacity, scale, rotate, x }}
        className={`group relative w-full md:w-[300px] ${
          step.position === "left" ? "md:mr-[30vw] md:pr-8" : "md:ml-[30vw] md:pl-8"
        }`}
      >
        {/* Connecting beam -> grows horizontally as reveal increases */}
        <motion.div
          style={{ transformOrigin: step.position === "left" ? "left center" : "right center", scaleX: beamScaleX, opacity }}
          className={`absolute hidden md:block top-1/2 -translate-y-1/2 h-1 z-10 ${
            step.position === "left"
              ? "left-full w-8 origin-left bg-gradient-to-r from-primary to-transparent"
              : "right-full w-8 origin-right bg-gradient-to-l from-primary to-transparent"
          }`}
        />

        <div className="relative group/card">
          <div
            className={`absolute -inset-0.5 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} rounded-3xl blur opacity-30 group-hover/card:opacity-60 transition-all duration-500`}
          />
          <div className="relative bg-card/95 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500">
            <div className="relative h-40 overflow-hidden">
              <img
                src={imageSrc}
                alt={step.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} mix-blend-overlay`} />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
              <div className="absolute top-4 left-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} backdrop-blur-md border-2 border-white/20 flex items-center justify-center shadow-2xl group-hover/card:scale-110 transition-all duration-500`}
                >
                  <Icon className="w-7 h-7 text-primary drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute top-4 right-4 text-7xl font-black text-white/5 select-none leading-none">{step.number}</div>
            </div>

            <div className="p-5 relative">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold group-hover/card:text-gradient transition-all duration-300">{step.title}</h3>
                <ArrowRight
                  className={`w-5 h-5 text-primary opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex-shrink-0 mt-1 ${
                    step.position === "left" ? "rotate-180" : ""
                  }`}
                />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>

              <div className="flex items-center gap-1.5">
                {PROCESS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i <= index ? "bg-primary flex-1" : "bg-primary/20 w-1"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${step.gradientFrom} ${step.gradientTo} ${
                step.position === "left" ? "right-0" : "left-0"
              }`}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

const TechnologySection = () => {
  // single source of truth for progress of the entire section
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"], // the whole section maps to 0..1
  });

  return (
    <>
      <style>{sectionStyles}</style>

      <section ref={sectionRef} className="py-12 md:py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-card/30 via-background to-background">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_20%_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_20%_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" aria-hidden="true" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-foreground/90">Advanced Technology</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
              Your Journey to
              <span className="block text-gradient mt-1">Perfect Dental Prosthetics</span>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground tech-description">
              Follow the path from digital scan to final delivery, powered by cutting-edge technology.
            </p>
          </div>

          <div className="relative mb-12 md:mb-16">
            {/* pass the same scroll progress to both the path and the cards */}
            <CurvedPath pathProgress={scrollYProgress} />

            <div className="relative">
              {PROCESS_STEPS.map((step, index) => (
                <ProcessStepCard key={step.id} step={step} index={index} pathProgress={scrollYProgress} />
              ))}
            </div>
          </div>

          <div className="text-center" style={{ animation: "fade-in 0.8s ease-out 2s both, scale-in 0.4s ease-out 2s both" }}>
            <Button variant="hero" size="lg" className="group" asChild>
              <a href="#contact">
                Start Your Journey
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TechnologySection;

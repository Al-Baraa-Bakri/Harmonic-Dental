import { TrendingUp, Users, Award, Globe } from "lucide-react";
import teamCollaborationImg from "@/assets/stats-background.jpg";
import { getImageSrc } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    number: "500+",
    label: "Dental Practices",
    description: "Trust our laboratory",
  },
  {
    icon: Award,
    number: "50K+",
    label: "Prosthetics Delivered",
    description: "With 99.9% satisfaction",
  },
  {
    icon: TrendingUp,
    number: "15+",
    label: "Years Experience",
    description: "In the industry",
  },
  {
    icon: Globe,
    number: "25+",
    label: "Countries Served",
    description: "Worldwide delivery",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={getImageSrc(teamCollaborationImg) as any}
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary-glow/5 to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Trusted by Professionals {' '}
              <span className="text-gradient mt-2">Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our commitment to excellence has earned us the trust of dental professionals globally.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative p-8 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all duration-500 hover-glow group text-center"
                style={{
                  animation: `fade-in 0.6s ease-out ${0.2 + index * 0.1}s both, scale-in 0.4s ease-out ${0.2 + index * 0.1}s both`,
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                {/* Number */}
                <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-primary/10 blur-xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

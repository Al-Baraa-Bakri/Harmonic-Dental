import { Award, Users, Microscope, Zap, Heart } from "lucide-react";
import teamCollaborationImg from "@/assets/stats-background.jpg";
import { getImageSrc } from "@/lib/utils";

// Data for this component
const whyChooseUs = [
  {
    icon: Zap,
    title: "Advanced Technology",
    description: "Equipped with the latest CAD/CAM systems, 3D printers, and milling machines to ensure precision and efficiency."
  },
  {
    icon: Users,
    title: "Skilled Technicians",
    description: "Our team comprises experienced dental technicians who are passionate about their craft and dedicated to delivering exceptional results."
  },
  {
    icon: Award,
    title: "Quality Materials",
    description: "We use only the finest materials, ensuring durability, functionality, and aesthetic appeal."
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description: "We work closely with dental professionals to understand and meet the specific needs of each case, ensuring patient satisfaction."
  }
];

const WhyChooseUs = () => {
  return (
    <div 
      className="mb-16 animate-fade-in relative overflow-hidden p-8 md:p-12 border border-border/20" 
      style={{ animationDelay: '0.7s' }}
    >
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
        
      <div className="relative">
        <h3 className="text-2xl md:text-3xl font-semibold mb-12 text-center flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Microscope className="w-7 h-7 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Why Choose Us?</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1 relative overflow-hidden"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-6 relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <item.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-base text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
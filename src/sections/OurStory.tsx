import { Award, Users, Target, Wrench, Shield, Microscope, Zap, Heart, Sparkles } from "lucide-react";
import dentalTechImg from "@/assets/dental-technology.jpg";
import teamWorkingImg from "@/assets/team-working.jpg";
import { getImageSrc } from "@/lib/utils";

const services = [
  {
    title: "Crown and Bridge Fabrication",
    items: [
      "Custom-made crowns and bridges",
      "Utilizing advanced CAD/CAM technology for precision"
    ]
  },
  {
    title: "Denture Creation and Repair",
    items: [
      "Full and partial dentures",
      "Rapid repair services to minimize patient inconvenience"
    ]
  },
  {
    title: "Orthodontic Appliances",
    items: [
      "Braces, retainers, and other corrective devices",
      "Designed for comfort and effectiveness"
    ]
  },
  {
    title: "Implant Prosthetics",
    items: [
      "High-quality prosthetic components for dental implants",
      "Ensuring a natural look and feel",
      "Custom abutment"
    ]
  },
  {
    title: "Custom Mouthguards",
    items: [
      "Tailor-made for sports or night use",
      "Protecting teeth with a perfect fit"
    ]
  }
];

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

const StorySection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header with accent line */}
        {/* <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Award className="w-4 h-4" />
            About Us
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            Our Story
          </h2>
          <p className="text-xl text-muted-foreground">
            Where precision meets innovation in dental excellence
          </p>
        </div> */}

        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
              <Award className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs text-foreground/90">About Us</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
              Our <span className="block text-gradient mt-1">Story</span>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground tech-description">
              Where precision meets innovation in dental excellence.
            </p>
        </div>

        {/* Two-column intro with floating card */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-primary font-semibold">
                  <div className="w-12 h-[2px] bg-primary" />
                  Since 2018
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Crafting Smiles with Precision & Innovation
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Welcome to Denta Dental Laboratory, where precision and innovation converge to create superior dental solutions. Our laboratory is a testament to our commitment to providing high-quality, custom-crafted dental products to enhance patient smiles and overall oral health.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Established in 2018, our state-of-the-art dental laboratory is committed to delivering high-quality dental restorations that enhance patient satisfaction and well-being.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-20 blur-3xl" />
                <img
                  src={getImageSrc(dentalTechImg)}
                  alt="Advanced dental technology"
                  className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission card with overlapping image */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="relative bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  Our Mission
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to provide dental professionals with superior dental appliances that are tailored to the unique needs of each patient. We strive to achieve excellence through innovation, precision, and dedicated customer service.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary border-2 border-background" />
                    <div className="w-10 h-10 rounded-full bg-accent border-2 border-background" />
                    <div className="w-10 h-10 rounded-full bg-primary/60 border-2 border-background" />
                  </div>
                  <span className="text-sm text-muted-foreground">Trusted by dental professionals</span>
                </div>
              </div>
              
              <div className="relative lg:absolute lg:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:w-[45%]">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl" />
                  <img
                    src={getImageSrc(teamWorkingImg)}
                    alt="Our team at work"
                    className="relative w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

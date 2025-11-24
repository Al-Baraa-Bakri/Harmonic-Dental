import {
  Award,
  Users,
  Target,
  Zap,
  Heart,
  Sparkles,
  Diamond,
} from "lucide-react";
import dentalTechImg from "@/assets/dental-technology.jpg";
import teamWorkingImg from "@/assets/team-working.jpg";
import { getImageSrc } from "@/lib/utils";

const services = [
  // ... (services data is not used in this section, but kept for completeness)
];

const whyChooseUs = [
  {
    icon: Zap,
    title: "Advanced Technology",
    description:
      "Equipped with the latest CAD/CAM systems, 3D printers, and milling machines to ensure precision and efficiency.",
  },
  {
    icon: Users,
    title: "Skilled Technicians",
    description:
      "Our team comprises experienced dental technicians who are passionate about their craft and dedicated to delivering exceptional results.",
  },
  {
    icon: Award,
    title: "Quality Materials",
    description:
      "We use only the finest materials, ensuring durability, functionality, and aesthetic appeal.",
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description:
      "We work closely with dental professionals to understand and meet the specific needs of each case, ensuring patient satisfaction.",
  },
];

const StorySection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-background text-foreground">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/10"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Pulsing Gradient Orb */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-foreground mb-4 transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
            <Award className="w-4 h-4 text-primary animate-pulse" />
            <span>About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 animate-slideInUp text-gradient-to-r from-primary to-accent !leading-[130%]">
            Our <span className="text-foreground">Journey</span> & Core Values
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fadeIn delay-300">
            Where precision meets innovation in dental excellence. We are
            dedicated to crafting superior, patient-focused dental solutions.
          </p>
        </div>

        {/* 2. Intro Story Section with Interactive Elements */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary font-bold text-lg animate-fadeInLeft">
                  <div className="w-12 h-1 bg-primary rounded-full animate-growWidth" />
                  <span className="uppercase tracking-widest text-sm">
                    Established{" "}
                    <Sparkles className="inline w-4 h-4 text-yellow-400 -mt-1" />{" "}
                    2018
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-snug animate-slideInUp">
                  Crafting Smiles with{" "}
                  <span className="text-primary">Precision</span> &{" "}
                  <span className="text-accent">Innovation</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/50 pl-4 animate-fadeIn delay-500">
                  Welcome to **Denta Dental Laboratory**, where precision and
                  innovation converge to create superior dental solutions. Our
                  laboratory is a testament to our commitment to providing
                  high-quality, custom-crafted dental products.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed animate-fadeIn delay-700">
                  Established in 2018, our state-of-the-art facility utilizes
                  **advanced CAD/CAM technology** to deliver dental restorations
                  that dramatically enhance patient satisfaction and well-being.
                </p>
              </div>
            </div>

            {/* Image with Parallax & Interactive Frame */}
            <div className="lg:order-2 relative group animate-fadeInRight">
              <div className="relative p-5 bg-card rounded-[3.5rem] shadow-2xl shadow-primary/20 transform group-hover:scale-[1.02] transition duration-500 ease-in-out border border-border">
                <img
                  src={getImageSrc(dentalTechImg)}
                  alt="Advanced dental technology"
                  className="w-full h-[480px] object-cover rounded-[3rem] border-4 border-primary/30 group-hover:border-accent/50 transition-colors duration-500"
                />
                {/* Floating Detail Card - more prominent */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl shadow-xl border-4 border-background w-4/5 text-center flex items-center justify-center gap-3 animate-bounceIn">
                  <Zap className="w-7 h-7" />
                  <p className="text-lg font-bold">
                    CAD/CAM Powered Innovation
                  </p>
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute inset-0 rounded-[3.5rem] bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            </div>
          </div>
        </div>

        {/* 3. Why Choose Us Section (Grid with Enhanced Hover) */}
        <div className="max-w-7xl mx-auto mb-24 md:mb-32">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-slideInUp">
            Why <span className="text-primary">Partner</span> With Us?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-card border border-border overflow-hidden relative
                           transition-all duration-500 ease-in-out hover:border-accent/70 hover:shadow-2xl hover:shadow-accent/20
                           transform hover:-translate-y-2 animate-fadeInUp delay-"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subtle Background Icon on hover */}
                <item.icon className="absolute -top-6 -right-6 w-24 h-24 text-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                <div className="relative z-10 space-y-4 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 
                                  group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-accent group-hover:border-transparent 
                                  transition-all duration-500 mx-auto mb-4 transform group-hover:scale-110"
                  >
                    <item.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors duration-500">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Mission Section (Dynamic & Interactive Overlap) */}
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-card to-card/50 rounded-[4rem] border border-border p-8 md:p-12 lg:p-16 overflow-hidden group">
            {/* Background Shape - more defined */}
            <div className="absolute top-0 right-0 w-2/5 h-full bg-accent/10 rounded-l-[4rem] opacity-70 hidden lg:block group-hover:w-1/2 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-1/5 h-full bg-primary/10 rounded-r-[4rem] opacity-70 hidden lg:block group-hover:w-1/4 transition-all duration-700" />

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div className="relative z-10 space-y-6 animate-fadeInLeft">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 transform group-hover:rotate-12 transition-transform duration-500">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="!leading-[130%] text-3xl md:text-4xl font-bold text-foreground text-gradient-to-r from-primary to-accent">
                  Our Unwavering{" "}
                  <span className="text-foreground">Mission</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is to provide dental professionals with **superior
                  dental appliances** that are tailored to the unique needs of
                  each patient. We strive to achieve excellence through
                  innovation, precision, and dedicated customer service.
                </p>
                <p className="text-lg text-primary font-medium flex items-center gap-2">
                  Committed to
                  quality, precision, and lasting partnership.
                </p>
              </div>

              {/* Image with Dynamic Frame and Quote */}
              <div className="relative lg:h-full animate-fadeInRight group-hover:scale-[1.01] transition-transform duration-700">
                <div className="relative p-4 bg-primary/20 rounded-3xl shadow-xl shadow-primary/20 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-0 lg:w-[120%] border border-primary/30">
                  <img
                    src={getImageSrc(teamWorkingImg)}
                    alt="Our team at work"
                    className="w-full h-[350px] lg:h-[480px] object-cover rounded-2xl shadow-inner border border-background"
                  />
                  {/* Testimonial/Quote Overlay */}
                  <div className="absolute -bottom-8 right-0 p-4 bg-card border border-border rounded-xl shadow-lg w-3/4 text-right transform group-hover:-translate-x-2 transition-transform duration-500">
                    <p className="text-sm italic text-muted-foreground">
                      "Innovation and reliability in every restoration."
                    </p>
                    <p className="text-xs font-semibold text-primary mt-1">
                      - Dr. Emily White
                    </p>
                  </div>
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

// Imports for this component are now reduced
import { Target, Wrench, Shield } from "lucide-react";

// --- 1. IMPORT YOUR NEW IMAGES ---
import introImage from "@/assets/product-crown.png"
import missionImage from "@/assets/product-crown.png";
import serviceCrowns from "@/assets/product-crown.png";
import serviceDentures from "@/assets/product-crown.png";
import serviceOrtho from "@/assets/product-crown.png";
import serviceImplant from "@/assets/product-crown.png";
import serviceMouthguard from "@/assets/product-crown.png";
// Note: whyChooseUsBg import is removed
import { getImageSrc } from "@/lib/utils";

// --- 2. UPDATE THE SERVICES ARRAY ---
const services = [
  {
    title: "Crown and Bridge Fabrication",
    imageSrc: getImageSrc(serviceCrowns),
    items: [
      "Custom-made crowns and bridges",
      "Utilizing advanced CAD/CAM technology for precision"
    ]
  },
  {
    title: "Denture Creation and Repair",
    imageSrc: getImageSrc(serviceDentures),
    items: [
      "Full and partial dentures",
      "Rapid repair services to minimize patient inconvenience"
    ]
  },
  {
    title: "Orthodontic Appliances",
    imageSrc: getImageSrc(serviceOrtho),
    items: [
      "Braces, retainers, and other corrective devices",
      "Designed for comfort and effectiveness"
    ]
  },
  {
    title: "Implant Prosthetics",
    imageSrc: getImageSrc(serviceImplant),
    items: [
      "High-quality prosthetic components for dental implants",
      "Ensuring a natural look and feel",
      "Custom abutment"
    ]
  },
  {
    title: "Custom Mouthguards",
    imageSrc: getImageSrc(serviceMouthguard),
    items: [
      "Tailor-made for sports or night use",
      "Protecting teeth with a perfect fit"
    ]
  }
];

// --- whyChooseUs data array is REMOVED ---

const StorySection = () => {
  return (
    <section className="py-12 md:py-20 lg:py-32 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in" style={{ animationDuration: '1s' }}>
              OUR STORY
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            About Denta Dental Laboratory
          </p>
        </div>

        {/* --- INTRO & MISSION LAYOUT --- */}
        <div className="space-y-16 md:space-y-24">

          {/* Introduction Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center md:text-left italic">
                Welcome to <span className="font-semibold text-primary">Denta Dental Laboratory</span>, where precision and innovation converge to create superior dental solutions. Our laboratory is a testament to our commitment to providing high-quality, custom-crafted dental products to enhance patient smiles and overall oral health.
              </p>
              
              <div className="mt-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <h3 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-3 relative">
                  <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <Target className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  Our Dedication to Excellence
                </h3>
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed relative">
                  At Denta Dental Laboratory, our story is built on a foundation of unwavering dedication to excellence. We bring together a team of skilled dental technicians who share a passion for their craft and a commitment to delivering the best in dental prosthetics.
                </p>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="group">
              <img 
                src={getImageSrc(introImage) as any}
                alt="Denta Dental Laboratory technician at work"
                className="rounded-3xl shadow-2xl shadow-primary/20 w-full h-full object-cover object-center max-h-[600px] border-4 border-primary/10 group-hover:border-primary/30 transition-all duration-500 group-hover:scale-[1.02]"
                width={800}
                height={900}
              />
            </div>
          </div>

          {/* Mission Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            
            {/* Left Column: Image */}
            <div className="group md:order-first">
              <img 
                src={getImageSrc(missionImage)  as any}
                alt="Advanced CAD/CAM dental technology"
                className="rounded-3xl shadow-2xl shadow-accent/20 w-full h-full object-cover object-center max-h-[500px] border-4 border-accent/10 group-hover:border-accent/30 transition-all duration-500 group-hover:scale-[1.02]"
                width={800}
                height={700}
              />
            </div>

            {/* Right Column: Text Content */}
            <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/15 backdrop-blur-sm border-2 border-primary/30 group hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <h3 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3 relative">
                <div className="p-3 rounded-xl bg-primary/30 group-hover:rotate-12 transition-transform duration-500">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Our Mission</span>
              </h3>
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed relative">
                Our mission is to provide dental professionals with superior dental appliances that are tailored to the unique needs of each patient. We strive to achieve excellence through innovation, precision, and dedicated customer service.
              </p>
            </div>
          </div>
        </div> {/* End of wrapper div */}

        {/* --- Commitment --- */}
        <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-accent/20 via-primary/20 to-accent/20 backdrop-blur-sm border-2 border-accent/40 animate-fade-in relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 mt-20" style={{ animationDelay: '0.9s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <h3 className="text-2xl md:text-4xl font-bold mb-6 text-center relative">
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">Our Commitment</span>
          </h3>
          <p className="text-base md:text-xl text-foreground/90 leading-relaxed text-center relative">
            At <span className="font-bold text-accent">Harmonic Dental Lab</span>, we are committed to setting the highest standards in the dental industry. From initial design to final delivery, we ensure every product we create is of the utmost quality and tailored to perfection. Our goal is to support dental professionals in providing their patients with the best possible care.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
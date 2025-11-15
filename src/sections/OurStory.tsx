import { Award, Users, Target, Wrench, Shield, Microscope, Zap, Heart } from "lucide-react";

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
    <section className="py-12 md:py-20 lg:py-32 relative overflow-hidden">
      {/* Enhanced Background decoration */}
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

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center italic">
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

          <div className="text-center py-8">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-sm border border-accent/20">
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                Welcome to <span className="font-bold text-accent">Harmonic Dental Laboratory</span> where cutting-edge technology meets expert craftsmanship. Established in <span className="font-semibold text-primary">2018</span>, our state-of-the-art dental laboratory is committed to delivering high-quality dental restorations that enhance patient satisfaction and well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto mb-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/15 via-accent/15 to-primary/15 backdrop-blur-sm border-2 border-primary/30 animate-fade-in relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500" style={{ animationDelay: '0.4s' }}>
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

        {/* Services */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-2xl md:text-3xl font-semibold mb-12 text-center flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse">
              <Wrench className="w-7 h-7 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Services</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 relative overflow-hidden"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <h4 className="text-lg font-semibold mb-4 text-primary group-hover:text-accent transition-colors duration-300 relative flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-accent transition-colors duration-300" />
                  {service.title}
                </h4>
                <ul className="space-y-3 relative">
                  {service.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-sm text-foreground/80 flex items-start gap-3 group-hover:text-foreground transition-colors duration-300 items-center"
                    >
                      <span className="text-primary mt-1 text-lg group-hover:scale-125 transition-transform duration-300">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.7s' }}>
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

        {/* Commitment */}
        <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-accent/20 via-primary/20 to-accent/20 backdrop-blur-sm border-2 border-accent/40 animate-fade-in relative overflow-hidden group hover:scale-[1.02] transition-all duration-500" style={{ animationDelay: '0.9s' }}>
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

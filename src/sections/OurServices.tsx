import { Wrench } from "lucide-react";

// --- Service Imports & Data ---
import serviceCrowns from "@/assets/product-crown.png";
import serviceDentures from "@/assets/product-crown.png";
import serviceOrtho from "@/assets/product-crown.png";
import serviceImplant from "@/assets/product-crown.png";
import serviceMouthguard from "@/assets/product-crown.png";
import { getImageSrc } from "@/lib/utils";

const services = [
  {
    title: "Crown and Bridge Fabrication",
    imageSrc: getImageSrc(serviceCrowns),
    description: "Utilizing advanced CAD/CAM technology for precision-milled, custom-made crowns and bridges."
  },
  {
    title: "Denture Creation and Repair",
    imageSrc: getImageSrc(serviceDentures),
    description: "Crafting full and partial dentures for optimal fit and function, plus rapid repair services."
  },
  {
    title: "Implant Prosthetics",
    imageSrc: getImageSrc(serviceImplant),
    description: "High-quality prosthetic components and custom abutments for dental implants, ensuring a natural look."
  },
  {
    title: "Orthodontic Appliances",
    imageSrc: getImageSrc(serviceOrtho),
    description: "Designing braces, retainers, and other corrective devices for comfort and effectiveness."
  },
  {
    title: "Custom Mouthguards",
    imageSrc: getImageSrc(serviceMouthguard),
    description: "Tailor-made protective mouthguards for sports or night use, ensuring a perfect fit."
  }
];

// --- Well-Designed, Responsive Grid ---
const OurServices = () => {
  return (
    <div className="my-16 md:my-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse">
            <Wrench className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Our Services
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          From foundational restorations to specialized appliances,
          every product is crafted with unparalleled precision.
        </p>
      </div>
      
      {/* Responsive Grid:
        - Mobile: 1 column (default)
        - Tablet (md): 2 columns
        - Desktop (lg): A 6-column grid for a custom 2-row (2-up, 3-up) layout
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        
        {services.map((service, index) => (
          <div
            key={service.title}
            className={`
              group rounded-2xl border border-border/50 bg-card/60
              overflow-hidden transition-all duration-300
              hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10
              hover:-translate-y-1
              ${index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}
            `}
            // Staggered animation delay
            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
          >
            {/* Card Image */}
            <div className="overflow-hidden">
              <img 
                src={service.imageSrc as any}
                alt={service.title}
                className="w-full h-48 object-cover 
                           transition-transform duration-500 ease-in-out
                           group-hover:scale-105"
                width={400}
                height={200}
                loading="lazy"
              />
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-foreground
                             group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-base text-muted-foreground">
                {service.description}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default OurServices;
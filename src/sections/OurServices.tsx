import { useState, useEffect, useRef } from "react";
import { Wrench } from "lucide-react";

// --- Service Imports & Data ---
import serviceCrowns from "@/assets/product-crown.png";
import serviceDentures from "@/assets/product-bridge.png";
import serviceOrtho from "@/assets/product-implant.png";
import serviceImplant from "@/assets/product-denture.png";
import serviceMouthguard from "@/assets/product-orthodontics.png";
import { getImageSrc } from "@/lib/utils";

const services = [
  {
    id: "crowns",
    title: "Crown and Bridge Fabrication",
    imageSrc: getImageSrc(serviceCrowns),
    items: [
      "Custom-made crowns and bridges",
      "Utilizing advanced CAD/CAM technology for precision",
    ],
  },
  {
    id: "dentures",
    title: "Denture Creation and Repair",
    imageSrc: getImageSrc(serviceDentures),
    items: [
      "Full and partial dentures",
      "Rapid repair services to minimize patient inconvenience",
    ],
  },
  {
    id: "implants",
    title: "Implant Prosthetics",
    imageSrc: getImageSrc(serviceImplant),
    items: [
      "High-quality prosthetic components for dental implants",
      "Ensuring a natural look and feel",
      "Custom abutment",
    ],
  },
  {
    id: "ortho",
    title: "Orthodontic Appliances",
    imageSrc: getImageSrc(serviceOrtho),
    items: [
      "Braces, retainers, and other corrective devices",
      "Designed for comfort and effectiveness",
    ],
  },
  {
    id: "mouthguards",
    title: "Custom Mouthguards",
    imageSrc: getImageSrc(serviceMouthguard),
    items: [
      "Tailor-made for sports or night use",
      "Protecting teeth with a perfect fit",
    ],
  },
];

const OurServices = () => {
  const [activeServiceId, setActiveServiceId] = useState(services[0].id);
  const serviceRefs = useRef({});

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

    // 🔥 Improved mobile-friendly detection
    const observerOptions = {
      root: null,
      rootMargin: isMobile ? "-20% 0px -20% 0px" : "-50% 0px -50% 0px",
      threshold: isMobile ? 0.2 : 0,
    };

    const observerCallback = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          setActiveServiceId(entry.target.dataset.serviceId);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const refs = serviceRefs.current;
    Object.values(refs).forEach((ref: any) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(refs).forEach((ref: any) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div
      className="my-16 md:my-24 animate-fade-in container"
      style={{ animationDelay: "0.5s" }}
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
          <Wrench className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs text-foreground/90">Our Services</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
          Precision-crafted solutions{" "}
          <span className="block text-gradient mt-1">
            for every dental need
          </span>
        </h2>

        <p className="text-sm md:text-base text-muted-foreground tech-description">
          combining artistry with advanced technology.
        </p>
      </div>

      {/* --- Main Layout Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* Left Column */}
        <div className="flex flex-col gap-12 lg:pt-12 lg:pb-[20vh]">
          {services.map((service) => (
            <div
              key={service.id}
              ref={(el: any) => ((serviceRefs as any).current[service.id] = el)}
              data-service-id={service.id}
              className={`transition-opacity duration-500 h-[450px] flex flex-col justify-center
                ${
                  activeServiceId === service.id
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-100"
                }
              `}
            >
              {/* Mobile Image */}
              <img
                src={service.imageSrc as any}
                alt={service.title}
                className="w-full h-auto aspect-video object-cover rounded-2xl mb-5 shadow-lg lg:hidden"
                width={600}
                height={400}
                loading="lazy"
              />

              {/* Service Details */}
              <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-primary">
                {service.title}
              </h3>

              <ul className="space-y-3.5">
                {service.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-lg text-foreground/90"
                  >
                    <span className="text-primary mt-1 text-xl font-bold leading-none">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right Column (Sticky Image) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-card/50 border border-border/50 overflow-hidden shadow-2xl shadow-primary/10">
              {services.map((service) => (
                <img
                  key={service.id}
                  src={service.imageSrc as any}
                  alt={service.title}
                  className={`
                    absolute inset-0 w-full h-full object-cover
                    transition-opacity duration-500 ease-in-out
                    ${
                      activeServiceId === service.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;

import { useState, useEffect, useRef } from "react";
import { Wrench } from "lucide-react";

const OurServices = ({
  headerBadge = "Our Services",
  headerTitle = "Precision-crafted solutions",
  headerHighlightedText = "for every dental need",
  headerSubtitle = "combining artistry with advanced technology.",
  services: propServices = [],
}: any) => {
  // Fallback services if none from Strapi
  const fallbackServices = [
    {
      id: 1,
      title: "Crown and Bridge Fabrication",
      image: { url: "", alternativeText: "", width: 600, height: 400 },
      items: [
        { id: 1, text: "Custom-made crowns and bridges" },
        { id: 2, text: "Utilizing advanced CAD/CAM technology for precision" },
      ],
      order: 1,
    },
    {
      id: 2,
      title: "Denture Creation and Repair",
      image: { url: "", alternativeText: "", width: 600, height: 400 },
      items: [
        { id: 1, text: "Full and partial dentures" },
        {
          id: 2,
          text: "Rapid repair services to minimize patient inconvenience",
        },
      ],
      order: 2,
    },
    {
      id: 3,
      title: "Implant Prosthetics",
      image: { url: "", alternativeText: "", width: 600, height: 400 },
      items: [
        {
          id: 1,
          text: "High-quality prosthetic components for dental implants",
        },
        { id: 2, text: "Ensuring a natural look and feel" },
        { id: 3, text: "Custom abutment" },
      ],
      order: 3,
    },
    {
      id: 4,
      title: "Orthodontic Appliances",
      image: { url: "", alternativeText: "", width: 600, height: 400 },
      items: [
        { id: 1, text: "Braces, retainers, and other corrective devices" },
        { id: 2, text: "Designed for comfort and effectiveness" },
      ],
      order: 4,
    },
    {
      id: 5,
      title: "Custom Mouthguards",
      image: { url: "", alternativeText: "", width: 600, height: 400 },
      items: [
        { id: 1, text: "Tailor-made for sports or night use" },
        { id: 2, text: "Protecting teeth with a perfect fit" },
      ],
      order: 5,
    },
  ];

  // Use Strapi services if available, otherwise fallback
  const services =
    propServices.length > 0
      ? [...propServices].sort((a, b) => {
          const orderA = a.order === 0 ? 999 : a.order;
          const orderB = b.order === 0 ? 999 : b.order;
          return orderA - orderB;
        })
      : fallbackServices;

  const [activeServiceId, setActiveServiceId] = useState(
    services[0]?.id || null
  );
  const serviceRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (services.length === 0) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

    // Improved mobile-friendly detection
    const observerOptions = {
      root: null,
      rootMargin: isMobile ? "-20% 0px -20% 0px" : "-50% 0px -50% 0px",
      threshold: isMobile ? 0.2 : 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const serviceId = parseInt(
            entry.target.getAttribute("data-service-id") || "0"
          );
          setActiveServiceId(serviceId);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const refs = serviceRefs.current;
    Object.values(refs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [services]);

  if (services.length === 0) {
    return (
      <div className="my-16 md:my-24 container">
        <div className="text-center text-muted-foreground">
          No services available
        </div>
      </div>
    );
  }

  return (
    <div
      className="my-16 md:my-24 animate-fade-in container"
      style={{ animationDelay: "0.5s" }}
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 tech-badge">
          <Wrench className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs text-foreground/90">{headerBadge}</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tech-heading">
          {headerTitle}{" "}
          <span className="block text-gradient mt-1">
            {headerHighlightedText}
          </span>
        </h2>

        <p className="text-sm md:text-base text-muted-foreground tech-description">
          {headerSubtitle}
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* Left Column - Service List */}
        <div className="flex flex-col gap-12 lg:pt-12 lg:pb-[20vh]">
          {services.map((service) => (
            <div
              key={service.id}
              ref={(el) => {
                serviceRefs.current[service.id] = el;
              }}
              data-service-id={service.id}
              className={`transition-opacity duration-500 min-h-[400px] flex flex-col justify-center
                ${
                  activeServiceId === service.id
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-100"
                }
              `}
            >
              {/* Mobile Image */}
              {service.image?.url && (
                <img
                  src={service.image.url}
                  alt={service.image.alternativeText || service.title}
                  className="w-full h-auto aspect-video object-cover rounded-2xl mb-5 shadow-lg lg:hidden"
                  width={service.image.width}
                  height={service.image.height}
                  loading="lazy"
                />
              )}

              {/* Service Details */}
              <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-primary">
                {service.title}
              </h3>

              <ul className="space-y-3.5">
                {service.items.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 text-lg text-foreground/90"
                  >
                    <span className="text-primary mt-1 text-xl font-bold leading-none">
                      •
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right Column - Sticky Image (Desktop Only) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-card/50 border border-border/50 overflow-hidden shadow-2xl shadow-primary/10">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`
                    absolute inset-0 w-full h-full
                    transition-opacity duration-500 ease-in-out
                    ${
                      activeServiceId === service.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }
                  `}
                >
                  {service.image?.url ? (
                    <img
                      src={service.image.url}
                      alt={service.image.alternativeText || service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Wrench className="w-24 h-24 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;

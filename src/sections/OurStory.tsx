import {
  Award,
  Users,
  Zap,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Icon mapping for Why Choose Us items (by order)
const ICON_MAP: LucideIcon[] = [Zap, Users, Award, Heart];

// Helper function to get icon by index
const getIconForItem = (index: number): LucideIcon => {
  return ICON_MAP[index] || Zap;
};

const StorySection = ({
  headerBadge = "About Us",
  headerTitle = "Our Journey & Core Values",
  headerSubtitle = "Where precision meets innovation in dental excellence. We are dedicated to crafting superior, patient-focused dental solutions.",
  establishedYear = "2018",
  storyHeading = "Crafting Smiles with Precision & Innovation",
  storyParagraph1 = "Welcome to our dental laboratory, where precision meets innovation.",
  storyParagraph2 = "Established in 2018, we have been serving dental professionals with excellence.",
  storyImage,
  storyImageFloatingText = "CAD/CAM Powered Innovation",
  whyChooseUsHeading = "Why Partner With Us?",
  whyChooseUsItems = [],
}: any) => {
  // Fallback items if none from Strapi
  const fallbackItems = [
    {
      id: 1,
      title: "Advanced Technology",
      description:
        "Equipped with the latest CAD/CAM systems, 3D printers, and milling machines to ensure precision and efficiency.",
      order: 0,
    },
    {
      id: 2,
      title: "Skilled Technicians",
      description:
        "Our team comprises experienced dental technicians who are passionate about their craft and dedicated to delivering exceptional results.",
      order: 1,
    },
    {
      id: 3,
      title: "Quality Materials",
      description:
        "We use only the finest materials, ensuring durability, functionality, and aesthetic appeal.",
      order: 2,
    },
    {
      id: 4,
      title: "Personalized Service",
      description:
        "We work closely with dental professionals to understand and meet the specific needs of each case, ensuring patient satisfaction.",
      order: 3,
    },
  ];

  const displayItems =
    whyChooseUsItems.length > 0 ? whyChooseUsItems : fallbackItems;

  return (
    <section
      id="about-us"
      className="py-20 md:py-32 relative overflow-hidden bg-background text-foreground"
    >
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
      {/* Pulsing Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-foreground mb-4 transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
            <Award className="w-4 h-4 text-primary animate-pulse" />
            <span>{headerBadge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 animate-slideInUp text-gradient-to-r from-primary to-accent !leading-[130%]">
            {headerTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fadeIn delay-300">
            {headerSubtitle}
          </p>
        </div>

        {/* 2. Intro Story Section */}
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
                    {establishedYear}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-snug animate-slideInUp">
                  {storyHeading}
                </h3>
                <div className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/50 pl-4 animate-fadeIn delay-500">
                  {storyParagraph1}
                </div>
                <div className="text-lg text-muted-foreground leading-relaxed animate-fadeIn delay-700">
                  {storyParagraph2}
                </div>
              </div>
            </div>

            {/* Image with Parallax & Interactive Frame */}
            <div className="lg:order-2 relative group animate-fadeInRight">
              <div className="relative p-5 bg-card rounded-[3.5rem] shadow-2xl shadow-primary/20 transform group-hover:scale-[1.02] transition duration-500 ease-in-out border border-border">
                {storyImage?.url ? (
                  <img
                    src={storyImage.url}
                    alt={
                      storyImage.alternativeText || "Advanced dental technology"
                    }
                    className="w-full h-[480px] object-cover rounded-[3rem] border-4 border-primary/30 group-hover:border-accent/50 transition-colors duration-500"
                  />
                ) : null}
                {/* Floating Detail Card */}
                {storyImageFloatingText && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl shadow-xl border-4 border-background w-4/5 text-center flex items-center justify-center gap-3 animate-bounceIn">
                    <Zap className="w-7 h-7" />
                    <p className="text-lg font-bold">
                      {storyImageFloatingText}
                    </p>
                  </div>
                )}
              </div>
              {/* Decorative Glow */}
              <div className="absolute inset-0 rounded-[3.5rem] bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
            </div>
          </div>
        </div>

        {/* 3. Why Choose Us Section */}
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-slideInUp">
            {whyChooseUsHeading}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayItems.map((item: any, index: number) => {
              const Icon = getIconForItem(index);

              return (
                <div
                  key={item.id}
                  className="group p-8 rounded-3xl bg-card border border-border overflow-hidden relative
                             transition-all duration-500 ease-in-out hover:shadow-2xl hover:shadow-accent/20
                             transform hover:-translate-y-2 animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Subtle Background Icon on hover */}

                  <div className="relative z-10 space-y-4 text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 
                                    
                                    transition-all duration-500 mx-auto mb-4 transform group-hover:scale-110"
                    >
                      <Icon className="w-7 h-7 text-primary transition-colors duration-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground transition-colors duration-500">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;

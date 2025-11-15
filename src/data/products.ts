import { Crown, Layers, Box, Gem, Smile, Braces, type LucideIcon } from "lucide-react";
import crownImage from "@/assets/product-crown.png";
import bridgeImage from "@/assets/product-bridge.png";
import implantImage from "@/assets/product-implant.png";
import veneerImage from "@/assets/product-veneer.png";
import dentureImage from "@/assets/product-denture.png";
import orthodonticsImage from "@/assets/product-orthodontics.png";


export interface Product {
  id: string;
  title: string;
  description: string;
  image: any;
  model?: string,
  icon: LucideIcon;
  features: string[];
  category: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "premium-crowns",
    title: "Premium Crowns",
    description: "High-strength ceramic and zirconia crowns designed for maximum durability and natural aesthetics. Perfect shade matching and precision fit guaranteed.",
    image: crownImage,
    icon: Crown,
    model: '/models/bridge-3d.glb',
    features: ["Zirconia & Ceramic", "Natural Look", "10-Year Warranty"],
    category: "Restorative",
    badge: "Popular",
  },
  {
    id: "custom-bridges",
    title: "Custom Bridges",
    description: "Expertly crafted bridge solutions that restore function and beauty. Multi-unit capabilities with advanced bonding techniques for lasting results.",
    image: bridgeImage,
    icon: Layers,
    features: ["Multi-Unit", "CAD/CAM Design", "Precision Fit"],
    category: "Restorative",
  },
  {
    id: "dental-implants",
    title: "Dental Implants",
    description: "Premium titanium implant solutions engineered for superior osseointegration. Complete from abutment to crown with perfect biological integration.",
    image: implantImage,
    icon: Box,
    features: ["Titanium Grade 5", "Perfect Integration", "24h Service"],
    category: "Implantology",
    badge: "Advanced",
  },
  {
    id: "porcelain-veneers",
    title: "Porcelain Veneers",
    description: "Ultra-thin porcelain veneers that transform smiles with minimal preparation. Exceptional translucency and stain-resistant properties.",
    image: veneerImage,
    icon: Gem,
    features: ["Ultra-Thin", "Stain Resistant", "Natural Translucency"],
    category: "Cosmetic",
  },
  {
    id: "complete-dentures",
    title: "Complete Dentures",
    description: "Full and partial denture solutions combining comfort with functionality. Advanced materials for superior retention and natural appearance.",
    image: dentureImage,
    icon: Smile,
    features: ["Full & Partial", "Comfortable Fit", "Natural Appearance"],
    category: "Prosthodontics",
  },
  {
    id: "orthodontic-solutions",
    title: "Orthodontic Solutions",
    description: "Modern orthodontic appliances including clear aligners and fixed appliances. Precise planning with 3D digital workflow for optimal results.",
    image: orthodonticsImage,
    icon: Braces,
    features: ["Clear Aligners", "3D Planning", "Fixed Appliances"],
    category: "Orthodontics",
    badge: "New",
  },
];

export const categories = [
  "All Products",
  "Restorative",
  "Implantology",
  "Cosmetic",
  "Prosthodontics",
  "Orthodontics",
];

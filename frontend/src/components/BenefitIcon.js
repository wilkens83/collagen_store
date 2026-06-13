import React from "react";
import {
  Leaf,
  Droplet,
  Flower2,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  Heart,
  MapPin,
  CheckCircle2,
  Eye,
} from "lucide-react";

const MAP = {
  leaf: Leaf,
  droplet: Droplet,
  flower: Flower2,
  sun: Sun,
  moon: Moon,
  sparkles: Sparkles,
  shield: ShieldCheck,
  heart: Heart,
  pin: MapPin,
  check: CheckCircle2,
  eye: Eye,
};

export default function BenefitIcon({ name, className = "", size = 28, strokeWidth = 1.5 }) {
  const Icon = MAP[name] || Leaf;
  return <Icon size={size} strokeWidth={strokeWidth} className={`text-gold ${className}`} />;
}

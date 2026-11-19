import {
  AirVent,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "./types";

export const CATEGORY_META: Record<
  Category,
  { icon: LucideIcon; blurb: string; tint: string }
> = {
  Smartphone: {
    icon: Smartphone,
    blurb: "Screens, batteries, ports & water damage",
    tint: "bg-orange-100 text-orange-700",
  },
  "Laptop & PC": {
    icon: Laptop,
    blurb: "Cleaning, upgrades & board repair",
    tint: "bg-sky-100 text-sky-700",
  },
  AC: {
    icon: AirVent,
    blurb: "Servicing, gas refill & compressor fixes",
    tint: "bg-cyan-100 text-cyan-700",
  },
  Refrigerator: {
    icon: Refrigerator,
    blurb: "Cooling faults, seals & thermostats",
    tint: "bg-emerald-100 text-emerald-700",
  },
  TV: {
    icon: Tv,
    blurb: "Backlight, panel & smart-TV repair",
    tint: "bg-violet-100 text-violet-700",
  },
  "Washing Machine": {
    icon: WashingMachine,
    blurb: "Drain, spin, motor & board faults",
    tint: "bg-indigo-100 text-indigo-700",
  },
  Electrical: {
    icon: Zap,
    blurb: "Fault finding, rewiring & switchboards",
    tint: "bg-amber-100 text-amber-700",
  },
};

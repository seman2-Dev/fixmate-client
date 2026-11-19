/* eslint-disable @next/next/no-img-element */
import { cn, initials } from "@/lib/utils";

const TONES = [
  "bg-brand-100 text-brand-800",
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
];

function tone(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

export function Avatar({
  name,
  image,
  size = "md",
  className,
}: {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const dims = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-lg",
    xl: "size-24 text-3xl",
  }[size];
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-white", dims, className)}
      />
    );
  }
  return (
    <span
      aria-label={name}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold ring-2 ring-white",
        dims,
        tone(name),
        className,
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}

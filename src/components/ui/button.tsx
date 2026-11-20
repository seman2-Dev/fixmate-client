import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold outline-none transition-[background-color,color,box-shadow,transform,border-color] duration-200 select-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:translate-y-px active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-brand-700 hover:shadow-md hover:shadow-primary/30",
        dark: "bg-ink-900 text-white shadow-sm hover:bg-ink-700 dark:bg-secondary dark:ring-1 dark:ring-border dark:hover:bg-ink-800",
        destructive: "bg-destructive text-white shadow-sm hover:bg-red-700 focus-visible:ring-destructive/30",
        success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500/30",
        outline:
          "border border-input bg-card text-foreground shadow-xs hover:border-ink-400 hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-ink-100",
        ghost: "text-foreground hover:bg-secondary",
        link: "h-auto rounded-sm p-0 text-primary underline-offset-4 hover:underline",
        glass: "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 gap-1.5 rounded-md px-3 text-[13px]",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };

"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

function SheetContent({
  className,
  children,
  side = "left",
  showClose = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "left" | "right"; showClose?: boolean }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-[100] bg-ink-950/60 backdrop-blur-[3px] data-[state=open]:animate-[fm-fade-in_.25s_ease-out] data-[state=closed]:animate-[fm-fade-in_.2s_ease-in_reverse_forwards]" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 z-[101] flex h-full w-[85%] max-w-sm flex-col shadow-pop outline-none",
          side === "left"
            ? "left-0 data-[state=open]:animate-[fm-slide-in-left_.3s_cubic-bezier(.22,1,.36,1)] data-[state=closed]:animate-[fm-slide-out-left_.22s_ease-in_forwards]"
            : "right-0 data-[state=open]:animate-[fm-slide-in-right_.3s_cubic-bezier(.22,1,.36,1)] data-[state=closed]:animate-[fm-slide-out-right_.22s_ease-in_forwards]",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            aria-label="Close menu"
            className="absolute top-3.5 right-3.5 grid size-9 cursor-pointer place-items-center rounded-lg text-current/70 transition-colors hover:bg-white/10 hover:text-current focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X className="size-5" />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("sr-only", className)} {...props} />;
}
function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn("sr-only", className)} {...props} />;
}
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };

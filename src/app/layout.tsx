import type { Metadata, Viewport } from "next";
import { CommandPalette } from "@/components/command-palette";
import { ThemedToaster, THEME_INIT_SCRIPT } from "@/components/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FixMate · Verified device & home appliance repair",
    template: "%s · FixMate",
  },
  description:
    "Book verified technicians to repair your phone, laptop, AC, fridge, TV and more. Track every job step by step and pay only after the work is done.",
};

export const viewport: Viewport = {
  themeColor: "#12202c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <CommandPalette />
        <ThemedToaster />
      </body>
    </html>
  );
}

import "./globals.css";
import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/ThemeProvider";
import { ModeToggle } from "./ToggleTheme";

const font = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BirdSky",
  description: "High in the sky, the birds fly freely.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          font.className,
        )}
      >
        <ThemeProvider>
          <ModeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

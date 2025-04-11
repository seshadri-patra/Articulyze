"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/practice", label: "Practice" },
  { href: "/camera", label: "Camera" },
  { href: "/tts", label: "TTS Lab" },
  { href: "/analytics", label: "Analytics" },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 backdrop-blur-md bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary">
            Articulyze
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-foreground/90",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </header>
  );
}

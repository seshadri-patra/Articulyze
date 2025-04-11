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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-lg bg-black/60 shadow-md"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
          >
            ✨
          </motion.span>
          <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition">
            Articulyze
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium relative transition-colors duration-300",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  {item.label}

                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-purple-500 to-blue-400 rounded-md"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}

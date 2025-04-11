"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const arrowVariants = {
  rest: {
    x: 0,
    opacity: 0.5,
  },
  hover: {
    x: 8,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LandingPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sections = [
    {
      title: "Practice Speaking",
      description: "Real-time AI feedback as you speak, powered by camera & audio.",
      href: "/practice",
      icon: "🎙️",
      bg: "from-indigo-500/10 to-blue-500/10",
      hoverBg: "from-indigo-500/20 to-blue-500/20",
    },
    {
      title: "Progress Tracker",
      description: "Deep analytics to track growth across vocabulary, emotion & focus.",
      href: "/analytics",
      icon: "📊",
      bg: "from-purple-500/10 to-pink-500/10",
      hoverBg: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "AI Insights",
      description: "Personalized tips & guidance for mastering conversation types.",
      href: "/insights",
      icon: "🧠",
      bg: "from-yellow-500/10 to-orange-500/10",
      hoverBg: "from-yellow-500/20 to-orange-500/20",
    },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 py-12 px-4"
    >
      <div className="max-w-5xl w-full mx-auto text-center space-y-6">
        <motion.div
          variants={fadeIn}
          className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md"
        >
          <motion.span
            className="inline-block text-6xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.span>{" "}
          Articulyze
        </motion.div>

        <motion.p
          className="text-lg text-muted-foreground/80 max-w-xl mx-auto"
          variants={fadeIn}
        >
          Elevate your speech. Analyze everything from eye contact to tone.
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full px-2"
        variants={container}
      >
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            variants={fadeIn}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={section.href}>
              <Card className={`relative group bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all duration-300 overflow-hidden`}>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${hoveredIndex === index ? section.hoverBg : section.bg} transition-all duration-500`}
                />
                <CardHeader className="relative z-10 py-8 text-center">
                  <motion.div
                    className="text-4xl"
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                      y: hoveredIndex === index ? -2 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    {section.icon}
                  </motion.div>
                  <CardTitle className="text-white text-xl font-semibold mt-4">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {section.description}
                  </CardDescription>
                  <motion.div
                    className="h-8 flex items-center justify-center mt-3"
                    initial="rest"
                    animate={hoveredIndex === index ? "hover" : "rest"}
                    variants={arrowVariants}
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.footer
  className="mt-24 w-full border-t border-white/10 pt-10 text-center text-sm text-muted-foreground/60"
  variants={fadeIn}
>
  <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
    {/* About */}
    <div>
      <h4 className="text-white font-semibold text-base mb-2">About Articulyze</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Crafted for communicators. Articulyze uses AI to give you deep, real-time insight into your voice, emotion, eye contact, and more.
      </p>
    </div>

    {/* Built With */}
    <div>
      <h4 className="text-white font-semibold text-base mb-2">Built With ❤️</h4>
      <ul className="text-sm space-y-1 text-muted-foreground">
        <li>⚡ Next.js + Vercel</li>
        <li>🎨 TailwindCSS + Radix UI</li>
        <li>🧠 Local + Cloud AI Analysis</li>
        <li>📦 Fully Component-Driven</li>
      </ul>
    </div>

    {/* Creator */}
    <div>
      <h4 className="text-white font-semibold text-base mb-2">Team & Credits</h4>
      <ul className="text-sm space-y-1 text-muted-foreground">
        <li>👾 Created by <span className="text-white font-medium">Team Bit-By-It</span></li>
        <li>🛠️ 100% Open Source & Extendable</li>
        <li>📍 Crafted with caffeine & code</li>
        <li>🌐 Version 1.0.0</li>
      </ul>
    </div>
  </div>

  <div className="mt-10 text-xs text-muted-foreground/60">
    © {new Date().getFullYear()} Articulyze. All rights reserved. | Made with 🤍 by <span className="font-semibold text-white">Team Bit-By-It</span>
  </div>
</motion.footer>
    </motion.main>
  );
}

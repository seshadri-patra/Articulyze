"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";
import Footer from "@/components/footer";
import WhyArticulyze from "@/components/WhyArticulyze";
import UseCases from "@/components/UseCases";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const arrowVariants = {
  rest: { x: 0, opacity: 0.5 },
  hover: {
    x: 8,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LandingPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sections = [
    {
      title: "Login / Signup",
      description: "Access your Articulyze dashboard with a secure account.",
      href: "/auth",
      icon: "🔐",
      bg: "from-emerald-400/20 to-emerald-600/20",
      hoverBg: "from-emerald-400/40 to-emerald-600/40",
    },
    {
      title: "Practice Speaking",
      description: "Get real-time AI feedback on delivery, tone, and eye contact.",
      href: "/practice",
      icon: "🎤",
      bg: "from-indigo-600/20 to-purple-600/20",
      hoverBg: "from-indigo-500/40 to-purple-500/40",
    },
    {
      title: "Progress Tracker",
      description: "Track your speaking growth with analytics and emotion trends.",
      href: "/analytics",
      icon: "📈",
      bg: "from-rose-500/20 to-pink-500/20",
      hoverBg: "from-rose-500/40 to-pink-500/40",
    },
    {
      title: "AI Insights",
      description: "Receive tailored recommendations and feedback after every session.",
      href: "/insights",
      icon: "💡",
      bg: "from-amber-400/20 to-orange-500/20",
      hoverBg: "from-amber-400/40 to-orange-500/40",
    },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#111827] py-16 px-4 text-white"
    >
      {/* Hero Section */}
      <div className="max-w-6xl w-full mx-auto text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
          variants={fadeIn}
        >
          Articulyze
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto"
          variants={fadeIn}
        >
          Speak boldly. Get smarter feedback. Transform how the world hears you.
        </motion.p>
      </div>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full px-2"
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
              <Card className="relative group bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-300 hover:border-primary/40 shadow-lg hover:shadow-blue-500/30">
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br blur-xl ${
                    hoveredIndex === index ? section.hoverBg : section.bg
                  } opacity-50 transition-opacity duration-500`}
                />
                <CardHeader className="relative z-10 py-10 text-center">
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
                  <CardTitle className="text-xl font-bold mt-4">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-300 mt-2">
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


      <WhyArticulyze />
      <UseCases />
              {/* Sample Report Preview Section */}
      <section className="mt-24 w-full max-w-6xl mx-auto px-4 text-white">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Sample Report Preview 📋
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            See the kind of insights you'll get after practicing with Articulyze.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Overview 📊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Total Words:</strong> 213</p>
              <p><strong>Unique Words:</strong> 74</p>
              <p><strong>Duration:</strong> 01m 48s</p>
              <p><strong>Logical Flow:</strong> 89%</p>
              <p><strong>Filler Words:</strong> 4.3%</p>
            </CardContent>
          </Card>

          {/* Emotions Card */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Emotions 🎭</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { emotion: "Happy", percentage: 42 },
                { emotion: "Neutral", percentage: 38 },
                { emotion: "Surprised", percentage: 20 },
              ].map((e) => (
                <div key={e.emotion}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{e.emotion}</span>
                    <span>{e.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${e.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gaze Card */}
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Gaze Direction 👀</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Looking Forward:</strong> 67%</p>
              <p><strong>Looking Down:</strong> 21%</p>
              <p><strong>Looking Away:</strong> 12%</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Link href="/practice">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition">
              🚀 Try It Yourself
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </motion.main>
  );
}

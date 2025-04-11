"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎥",
    title: "Record & Analyze",
    description:
      "Capture your speaking style with camera + mic and get detailed AI-powered feedback post-session.",
  },
  {
    icon: "👀",
    title: "Eye Contact Detection",
    description:
      "Track your gaze and engagement to see how confident and connected you appear.",
  },
  {
    icon: "😊",
    title: "Emotion & Tone Analysis",
    description:
      "Understand how your expressions and vocal tone influence message clarity and impact.",
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    description:
      "Monitor vocabulary variety, speech coherence, and filler words over time.",
  },
  {
    icon: "📤",
    title: "Export Reports",
    description:
      "Download personalized AI summaries as PDFs — ideal for coaching or showcasing growth.",
  },
  {
    icon: "🧭",
    title: "Scenario Practice Modes",
    description:
      "Practice job interviews, presentations, debates and more. Adapt your style to any context.",
  },
];

export default function WhyArticulyze() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-24">
      <div className="text-center mb-16 space-y-3">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🧠 Why Articulyze?
        </motion.h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Post-session analysis backed by AI — get smarter insights and grow your communication superpowers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 blur-lg rounded-xl transition-all duration-500" />

            <div className="relative z-10">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

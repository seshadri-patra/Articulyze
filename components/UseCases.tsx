"use client";

import { motion } from "framer-motion";

const useCases = [
  {
    title: "🎤 Job Interviews",
    description: "Practice answering tough questions with confidence and clarity.",
  },
  {
    title: "🧑‍🏫 Presentations",
    description: "Polish your delivery style and improve clarity for audiences.",
  },
  {
    title: "🗣️ Debates & Pitches",
    description: "Learn to structure arguments and control tone under pressure.",
  },
  {
    title: "💼 Team Meetings",
    description: "Stay sharp in daily standups or virtual syncs with better articulation.",
  },
  {
    title: "🧘 Confidence Building",
    description: "Track progress over time and grow into a powerful communicator.",
  },
  {
    title: "📚 Language Practice",
    description: "Perfect your fluency, grammar, and vocal rhythm in any language.",
  },
];

export default function UseCases() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-12 space-y-3">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎯 Where Can You Use Articulyze?
        </motion.h2>
        <p className="text-gray-400 text-base md:text-lg">
          From interviews to improv — master your message, anywhere it matters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((item, i) => (
          <motion.div
            key={item.title}
            className="relative group bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-xl transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-lg opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-4xl mb-3">{item.title.split(" ")[0]}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title.split(" ").slice(1).join(" ")}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

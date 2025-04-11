"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const insights = [
  {
    icon: "💬",
    title: "Speech Clarity",
    description:
      "Your speech is clear but occasionally drifts. Try to pace your words evenly and avoid filler phrases.",
  },
  {
    icon: "😊",
    title: "Emotion Usage",
    description:
      "Good emotional variation! Slightly increase enthusiasm when discussing important points to maximize impact.",
  },
  {
    icon: "👀",
    title: "Eye Contact",
    description:
      "Great job maintaining focus. For higher engagement, practice scanning across your audience subtly.",
  },
  {
    icon: "🧠",
    title: "Vocabulary Strength",
    description:
      "Your vocabulary is solid. Experiment with synonyms and transitional phrases for stronger delivery.",
  },
  {
    icon: "📈",
    title: "Progress Snapshot",
    description:
      "You've improved in emotion and eye contact over your last 3 sessions. Keep building confidence!",
  },
];

export default function InsightsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          💡 AI Insights
        </h1>
        <p className="text-gray-400 text-base max-w-2xl mx-auto">
          Personalized tips and smart feedback generated from your last speaking sessions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">{insight.icon}</div>
                <CardTitle className="text-lg font-semibold">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 text-center leading-relaxed">
                {insight.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

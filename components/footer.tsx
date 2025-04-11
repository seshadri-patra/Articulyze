"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-24 w-full border-t border-white/10 pt-10 text-center text-sm text-gray-500 bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        {/* About */}
        <div>
          <h4 className="text-white font-semibold mb-2">About Articulyze</h4>
          <p>
            Built to supercharge your speaking. Get clarity, charisma, and control using
            AI-powered performance analysis.
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="text-white font-semibold mb-2">Built With ❤️</h4>
          <ul className="space-y-1">
            <li>⚡ Next.js + Vercel</li>
            <li>🎨 Tailwind + Radix UI</li>
            <li>🎥 MediaRecorder & Web APIs</li>
            <li>🧠 Python AI backend</li>
          </ul>
        </div>

        {/* Team & Credits */}
        <div>
          <h4 className="text-white font-semibold mb-2">Credits</h4>
          <ul className="space-y-1">
            <li>
              👾 Created by{" "}
              <span className="text-white font-medium">Team Bit-By-Bit</span>
            </li>
            <li>🛠️ 100% Open Source</li>
            <li>📍 Version 1.0.0</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-600 text-center">
        © {new Date().getFullYear()} Articulyze. Made with ☕ by{" "}
        <span className="font-semibold text-white">Team Bit-By-Bit</span>
      </div>
    </motion.footer>
  );
}

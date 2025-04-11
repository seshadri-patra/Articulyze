"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

export default function TTSPage() {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voice, setVoice] = useState("f8698a9e-947a-43cd-a897-57edd4070a78");
  const [speed, setSpeed] = useState([1.0]);

  const voices = [
    { id: "f8698a9e-947a-43cd-a897-57edd4070a78", name: "Albert (British Male)" },
    { id: "79ffd956-872a-4b89-b25b-d99bb4335b82", name: "Liz (British Female)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setAudio(null);

    try {
      const response = await fetch("http://localhost:5328/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/wav",
        },
        body: JSON.stringify({ text, voice, speed: speed[0] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);

      setAudio(audioURL);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        URL.revokeObjectURL(audio);
      }
    };
  }, [audio]);

  return (
    <main className="min-h-screen w-full px-4 py-10 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            🧠 Text-to-Speech Lab
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Convert any text into intelligent, natural-sounding speech powered by AI.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-lg font-semibold text-purple-200 flex items-center gap-2">
                🛠️ Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Voice Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Voice</label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger className="bg-white/10 backdrop-blur-md border border-white/10">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speech Speed */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Speed</label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.7}
                    max={2.0}
                    step={0.1}
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {speed[0].toFixed(1)}x speed
                  </div>
                </div>

                {/* Text Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Text</label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text here..."
                    className="h-32 bg-white/10 backdrop-blur-md border border-white/10 text-white"
                  />
                  <div className="text-right text-xs text-muted-foreground">
                    {text.length} characters
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:from-purple-600 hover:to-blue-600"
                  disabled={isLoading || !text.trim()}
                >
                  {isLoading ? "Generating..." : "Generate Speech"}
                </Button>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 text-center">Error: {error}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Audio Player */}
        {audio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-center text-lg text-blue-300 font-semibold">
                  🔊 Playback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <audio controls src={audio} className="w-full mt-2 rounded-md" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Click play to listen to your generated audio
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}

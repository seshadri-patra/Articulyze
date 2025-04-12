"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface EmotionEntry {
  emotion: string;
  percentage: number;
  count?: number;
}

interface GazeEntry {
  direction: string;
  percentage: number;
}

interface SpeechAnalysis {
  ttr_analysis: { ttr: number; unique_words: number; diversity_level: string };
  logical_flow: { score: number };
  filler_percentage: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    totalDuration: 0,
    averageEmotions: [] as EmotionEntry[],
    averageGazeDirections: [] as GazeEntry[],
    averageFillerWords: 0,
    averageVocabularyScore: 0,
    averageLogicalFlow: 0,
    averageSessionDuration: 0,
  });

  useEffect(() => {
    const recordings = Object.keys(localStorage).filter((key) =>
      key.startsWith("recording_analysis_")
    );

    const accumulator = {
      totalSessions: 0,
      totalDuration: 0,
      emotions: {} as Record<string, { sum: number; count: number }>,
      gaze: {} as Record<string, number>,
      vocabScores: [] as number[],
      flowScores: [] as number[],
      fillerScores: [] as number[],
    };

    recordings.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      if (!data.emotions || !data.gaze) return;

      accumulator.totalSessions++;
      accumulator.totalDuration += data.duration || 0;

      // Emotions
      data.emotions.forEach((entry: any) => {
        Object.entries(entry.emotions).forEach(([emotion, val]) => {
          if (!accumulator.emotions[emotion]) {
            accumulator.emotions[emotion] = { sum: 0, count: 0 };
          }
          accumulator.emotions[emotion].sum += val as number;
          accumulator.emotions[emotion].count++;
        });
      });

      // Gaze
      data.gaze.forEach((g: any) => {
        accumulator.gaze[g.direction] = (accumulator.gaze[g.direction] || 0) + 1;
      });

      const id = key.replace("recording_analysis_", "");
      const speech = JSON.parse(localStorage.getItem(`speech_analysis_${id}`) || "{}") as SpeechAnalysis;

      if (speech?.ttr_analysis?.ttr) accumulator.vocabScores.push(speech.ttr_analysis.ttr * 100);
      if (speech?.logical_flow?.score) accumulator.flowScores.push(speech.logical_flow.score);
      if (typeof speech?.filler_percentage === "number") accumulator.fillerScores.push(speech.filler_percentage);
    });

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const averageEmotions = Object.entries(accumulator.emotions)
      .map(([emotion, { sum, count }]) => ({
        emotion,
        percentage: (sum / count) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    const averageGazeDirections = Object.entries(accumulator.gaze).map(
      ([direction, count]) => ({
        direction,
        percentage: (count / accumulator.totalSessions) * 100,
      })
    );

    setAnalytics({
      totalSessions: accumulator.totalSessions,
      totalDuration: accumulator.totalDuration,
      averageSessionDuration: accumulator.totalSessions
        ? accumulator.totalDuration / accumulator.totalSessions
        : 0,
      averageEmotions,
      averageGazeDirections,
      averageVocabularyScore: avg(accumulator.vocabScores),
      averageLogicalFlow: avg(accumulator.flowScores),
      averageFillerWords: avg(accumulator.fillerScores),
    });
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const hrs = Math.floor(seconds / 3600);
    return `${hrs}h ${mins}m`;
  };

  return (
    <main className="container py-12 space-y-12 text-white">
      <div className="text-center space-y-3">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Communication Dashboard
        </motion.h1>
        <p className="text-muted-foreground text-sm">
          Personalized insights powered by <span className="font-semibold text-white">Articulyze</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Practice Sessions 📊",
            value: analytics.totalSessions,
            subtitle: "Total recordings",
          },
          {
            title: "Total Time ⏱️",
            value: formatDuration(analytics.totalDuration),
            subtitle: "Time spent speaking",
          },
          {
            title: "Avg. Duration ⌛",
            value: formatDuration(analytics.averageSessionDuration),
            subtitle: "Per session",
          },
          {
            title: "Flow Score 🌊",
            value: `${analytics.averageLogicalFlow.toFixed(1)}%`,
            subtitle: "Speech coherence",
          },
        ].map((stat, i) => (
          <Card
            key={stat.title}
            className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-white/10 shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-center">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Speech Scores */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Vocabulary 🧠",
            value: `${analytics.averageVocabularyScore.toFixed(1)}%`,
          },
          {
            title: "Logical Flow 🧩",
            value: `${analytics.averageLogicalFlow.toFixed(1)}%`,
          },
          {
            title: "Filler Words 🚫",
            value: `${analytics.averageFillerWords.toFixed(1)}%`,
          },
        ].map((metric) => (
          <Card key={metric.title} className="bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-center">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-3xl font-bold">
              {metric.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emotions */}
      <Card className="bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="text-center">Top Emotions 😊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.averageEmotions.map((e) => (
            <div key={e.emotion}>
              <div className="flex justify-between text-sm">
                <span className="capitalize">{e.emotion}</span>
                <span>{e.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={e.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gaze */}
      <Card className="bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="text-center">Gaze Engagement 👀</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.averageGazeDirections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="direction" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-white/5 border border-white/10">
        <CardHeader>
          <CardTitle className="text-center">Personalized Tips 💡</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            analytics.averageFillerWords > 15
              ? "Try to reduce filler words for better clarity."
              : "Excellent control over filler words! 👌",
            analytics.averageVocabularyScore < 40
              ? "Use more diverse vocabulary to sound sharper."
              : "Great vocabulary range! 🔥",
            analytics.averageLogicalFlow < 50
              ? "Improve transitions between points."
              : "Smooth flow of ideas. Keep it up! 💫",
          ].map((tip, i) => (
            <div key={i} className="p-3 bg-primary/10 rounded-md">
              {tip}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

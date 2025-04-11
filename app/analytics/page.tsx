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
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
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

interface AnalyticsAccumulator {
  totalSessions: number;
  totalDuration: number;
  averageEmotions: EmotionEntry[];
  averageGazeDirections: GazeEntry[];
  speechMetrics: {
    vocabularyScores: number[];
    logicalFlowScores: number[];
    fillerPercentages: number[];
  };
}

interface AggregatedAnalytics {
  totalSessions: number;
  totalDuration: number;
  averageEmotions: EmotionEntry[];
  averageGazeDirections: GazeEntry[];
  averageFillerWords: number;
  averageVocabularyScore: number;
  averageLogicalFlow: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AggregatedAnalytics>({
    totalSessions: 0,
    totalDuration: 0,
    averageEmotions: [],
    averageGazeDirections: [],
    averageFillerWords: 0,
    averageVocabularyScore: 0,
    averageLogicalFlow: 0,
  });

  useEffect(() => {
    const recordings = Object.keys(localStorage).filter((key) =>
      key.startsWith("recording_analysis_")
    );

    const aggregated = recordings.reduce<AnalyticsAccumulator>(
      (acc, key) => {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (!data.emotions || !data.gaze) return acc;

        acc.totalSessions++;
        acc.totalDuration += data.duration || 0;

        data.emotions.forEach((entry: any) => {
          Object.entries(entry.emotions).forEach(([emotion, value]) => {
            const existing = acc.averageEmotions.find((e) => e.emotion === emotion);
            if (existing) {
              existing.percentage += value as number;
              existing.count = (existing.count || 1) + 1;
            } else {
              acc.averageEmotions.push({ emotion, percentage: value as number, count: 1 });
            }
          });
        });

        data.gaze.forEach((entry: any) => {
          const existing = acc.averageGazeDirections.find((g) => g.direction === entry.direction);
          if (existing) {
            existing.percentage += 1;
          } else {
            acc.averageGazeDirections.push({ direction: entry.direction, percentage: 1 });
          }
        });

        try {
          const speechKey = `speech_analysis_${key.split("_").pop()}`;
          const speech = JSON.parse(localStorage.getItem(speechKey) || "{}") as SpeechAnalysis;

          if (speech.ttr_analysis) {
            acc.speechMetrics.vocabularyScores.push(speech.ttr_analysis.ttr * 100);
          }
          if (speech.logical_flow) {
            acc.speechMetrics.logicalFlowScores.push(speech.logical_flow.score);
          }
          if (typeof speech.filler_percentage === "number") {
            acc.speechMetrics.fillerPercentages.push(speech.filler_percentage);
          }
        } catch (err) {
          console.warn("Failed to parse speech data:", err);
        }

        return acc;
      },
      {
        totalSessions: 0,
        totalDuration: 0,
        averageEmotions: [],
        averageGazeDirections: [],
        speechMetrics: {
          vocabularyScores: [],
          logicalFlowScores: [],
          fillerPercentages: [],
        },
      }
    );

    const getAverage = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    aggregated.averageEmotions = aggregated.averageEmotions
      .map((e) => ({
        emotion: e.emotion,
        percentage: (e.percentage / (e.count || 1)) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    aggregated.averageGazeDirections = aggregated.averageGazeDirections
      .map((g) => ({
        direction: g.direction,
        percentage: (g.percentage / aggregated.totalSessions) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    setAnalytics({
      totalSessions: aggregated.totalSessions,
      totalDuration: aggregated.totalDuration,
      averageEmotions: aggregated.averageEmotions,
      averageGazeDirections: aggregated.averageGazeDirections,
      averageVocabularyScore: getAverage(aggregated.speechMetrics.vocabularyScores),
      averageLogicalFlow: getAverage(aggregated.speechMetrics.logicalFlowScores),
      averageFillerWords: getAverage(aggregated.speechMetrics.fillerPercentages),
    });
  }, []);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <main className="container py-12 space-y-12">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Practice Sessions 📊",
            value: analytics.totalSessions,
            subtitle: "Total recorded sessions",
          },
          {
            title: "Total Time ⏱️",
            value: formatDuration(analytics.totalDuration),
            subtitle: "Time invested in practice",
          },
          {
            title: "Flow Score 🌊",
            value: `${analytics.averageLogicalFlow.toFixed(1)}%`,
            subtitle: "Speech coherence",
          },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-[#1f2937]/60 to-[#111827]/80 border border-white/10 text-white shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="text-center text-lg font-semibold">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Emotions */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md text-white">
          <CardHeader>
            <CardTitle className="flex justify-center gap-2">Emotional Expression 😊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.averageEmotions.map((emotion) => (
              <div key={emotion.emotion} className="space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span className="capitalize">{emotion.emotion}</span>
                  <span>{emotion.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={emotion.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gaze Patterns */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md text-white">
          <CardHeader>
            <CardTitle className="flex justify-center gap-2">Gaze Patterns 👀</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.averageGazeDirections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="direction" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radial Score */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md text-white">
          <CardHeader>
            <CardTitle className="flex justify-center gap-2">Speech Quality 🎯</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={[
                  {
                    name: "Vocabulary",
                    value: analytics.averageVocabularyScore,
                    fill: "hsl(var(--primary))",
                  },
                  {
                    name: "Flow",
                    value: analytics.averageLogicalFlow,
                    fill: "hsl(var(--primary) / 0.7)",
                  },
                ]}
                startAngle={180}
                endAngle={0}
              >
                <PolarRadiusAxis type="number" domain={[0, 100]} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={15}
                  label={{ fill: "#fff", position: "insideStart" }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md text-white">
          <CardHeader>
            <CardTitle className="flex justify-center gap-2">Insights 💡</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {[
              {
                title: "Emotional Range",
                message:
                  "You're showing a healthy mix of emotions — try to improve the pacing between transitions.",
              },
              {
                title: "Gaze Engagement",
                message:
                  "Try distributing your gaze evenly and confidently — aim for natural movement.",
              },
              {
                title: "Logical Flow",
                message:
                  "Solid coherence! Focus on smooth transitions to elevate your storytelling.",
              },
            ].map((insight) => (
              <div
                key={insight.title}
                className="p-4 bg-primary/10 rounded-lg border border-white/10"
              >
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-muted-foreground">{insight.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

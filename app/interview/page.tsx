"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const router = useRouter();
  const [position, setPosition] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: position }),
      });
      const data = await res.json();
      if (data?.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((res) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            res(true);
          };
        });
      }
      streamRef.current = stream;
      setIsStreaming(true);
    } catch (err) {
      setError("Unable to access camera or microphone.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    setError(null);
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = handleUpload;
    recorder.start(100);
    recorderRef.current = recorder;
    setIsRecording(true);
    setRecordingDuration(0);
    timerRef.current = setInterval(() => setRecordingDuration((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleUpload = async () => {
    const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", videoBlob, "interview.webm");

    try {
      setIsUploading(true);
      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      localStorage.setItem(`recording_analysis_${data.filename}`, JSON.stringify({
        category: "interview",
        duration: recordingDuration,
        timestamp: new Date().toISOString()
      }));

      router.push(`/recordings/${data.filename}?audio=${data.audio_filename}`);
    } catch (err) {
      setError("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <main className="min-h-screen py-16 px-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
          Mock Interview
        </h1>
        <p className="text-gray-300 text-sm">
          Prepare for your next opportunity like a pro.
        </p>
      </div>

      {/* Role input */}
      <Card className="bg-white/10 border border-white/10 backdrop-blur-lg shadow-xl max-w-xl mx-auto mb-10">
        <CardHeader>
          <CardTitle className="text-white">Setup</CardTitle>
          <CardDescription className="text-sm text-gray-300">
            Enter the role you're preparing for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Product Manager"
              className="mt-2 bg-white/10 text-white placeholder:text-gray-300"
            />
          </div>
          <Button onClick={fetchQuestions} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Start Interview"}
          </Button>
        </CardContent>
      </Card>

      {/* Questions */}
      {questions.length > 0 && (
        <Card className="bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3 text-white">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                {isRecording ? "Recording..." : "Ready"}
              </CardTitle>
              <span className="text-sm text-gray-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-lg text-center font-medium text-white"
              >
                {questions[currentIndex]}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentIndex((i) =>
                    i + 1 < questions.length ? i + 1 : i
                  )
                }
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>

            <div className="aspect-video bg-black relative rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="absolute w-full h-full object-contain"
                autoPlay
                playsInline
                muted={isRecording}
              />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full">
                  {formatDuration(recordingDuration)}
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!isRecording && (
                <Button onClick={isStreaming ? stopCamera : startCamera}>
                  {isStreaming ? "Stop Camera" : "Start Camera"}
                </Button>
              )}
              {isStreaming && (
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="px-6"
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {error && (
        <p className="mt-6 text-center text-sm text-red-400">{error}</p>
      )}

      {/* Uploading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-black text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-semibold">Uploading recording...</p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}
    </main>
  );
}

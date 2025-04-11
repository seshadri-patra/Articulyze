"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InterviewPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 6;

  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: Implement recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: Implement stop recording logic
  };

  return (
    <main className="container max-w-4xl mx-auto py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Practice Interview
        </h1>
        <p className="text-muted-foreground text-sm">
          Simulate a real interview session with <span className="font-semibold text-primary">Articulyze</span>
        </p>
      </div>

      <div className="space-y-8">
        {/* Position Selection */}
        <Card className="bg-white/80 backdrop-blur-md shadow-md">
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
            <CardDescription>
              What role are you preparing for?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="position">Desired Position</Label>
              <Input
                id="position"
                placeholder="e.g. Software Engineer, Product Manager"
                className="mt-1.5"
              />
            </div>
            <Button className="w-full">Start Interview</Button>
          </CardContent>
        </Card>

        {/* Interview Session */}
        <Card className="bg-white/80 backdrop-blur-md shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition ${
                    isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span>{isRecording ? "Recording..." : "Ready"}</span>
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion} of {totalQuestions}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Visualization */}
            <div className="aspect-[3/2] bg-muted/30 rounded-lg flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-700 ${
                  isRecording ? "scale-110 bg-primary/20" : ""
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-700 ${
                    isRecording ? "scale-110 bg-primary/30" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-primary transition-all duration-700 ${
                      isRecording ? "scale-110" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Control Button */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>

            {/* Tips */}
            <div className="space-y-2 text-sm text-muted-foreground text-center">
              <p>• Make sure your volume is up</p>
              <p>• Speak clearly and at a natural pace</p>
              <p>• Position yourself in a well-lit environment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

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
    <main className="container mx-auto max-w-3xl p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🗣️ Text-to-Speech Lab</h1>
        <p className="text-muted-foreground text-sm">
          Convert any text into lifelike speech with custom voices and speeds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">🎛️ Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voice Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">Speed</label>
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
              <label className="text-sm font-medium">Text</label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text here..."
                className="h-32"
              />
              <div className="text-right text-xs text-muted-foreground">
                {text.length} characters
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
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

      {/* Audio Player */}
      {audio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">
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
      )}
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5328";

export default function EyeTracking() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function requestCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);

        if (imgRef.current) {
          imgRef.current.src = `${API_URL}/api/video_feed?t=${Date.now()}`;
        }
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasPermission(false);
        setError("Camera access denied. Please enable permissions for eye tracking.");
      }
    }

    requestCameraPermission();

    let interval: NodeJS.Timeout;
    if (hasPermission) {
      interval = setInterval(() => {
        if (imgRef.current) {
          imgRef.current.src = `${API_URL}/api/video_feed?t=${Date.now()}`;
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasPermission]);

  return (
    <main className="container py-10 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Real-Time Eye Tracking</h1>
        <p className="text-muted-foreground text-sm">
          Gaze detection powered by <span className="text-primary font-semibold">Articulyze</span>
        </p>
      </div>

      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden border shadow-md bg-muted/30 backdrop-blur-md">
        {hasPermission === null ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Requesting camera permission...</p>
          </div>
        ) : hasPermission === false ? (
          <div className="flex items-center justify-center h-full bg-red-50 p-6">
            <p className="text-center text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="relative h-full">
            <img
              ref={imgRef}
              className="w-full h-full object-contain"
              alt="Eye tracking feed"
              onError={() =>
                setError(
                  "Unable to load video feed. Please ensure the backend server is running."
                )
              }
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 p-6">
                <p className="text-center text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {hasPermission && !error && (
        <div className="space-y-6">
          <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            <p>
              <strong>Green</strong> dots show facial landmarks. <strong>Blue</strong> rectangles indicate detected faces.
            </p>
            <p>
              <strong>Red</strong> arrows visualize gaze direction, and on-screen data shows pitch/yaw and target zones.
            </p>
          </div>

          <div className="bg-primary/10 p-6 rounded-lg border max-w-2xl mx-auto">
            <h2 className="font-semibold text-lg mb-3">Gaze Detection Key</h2>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4 list-disc">
              <li><code>center</code>: Looking directly at the camera</li>
              <li><code>up</code>, <code>down</code>, <code>left</code>, <code>right</code>: Directional glances</li>
              <li><code>up-left</code>, <code>down-right</code>, etc.: Combined angles</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

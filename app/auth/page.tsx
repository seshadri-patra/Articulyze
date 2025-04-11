"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push("/");
    })();
  }, []);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        const { error: insertError } = await supabase.from("users").upsert([
          {
            id: userId,
            email,
            full_name: fullName,
          },
        ]);

        if (insertError) {
          setError("User created, but profile not saved.");
        }
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }
    }

    // Reset and redirect
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setLoading(false);
    router.push("/");
  };

  const handleOAuth = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center space-y-2 mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </motion.h1>
          <p className="text-sm text-gray-400">
            {mode === "login"
              ? "Login to continue your journey"
              : "Join us and level up your communication"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {mode === "signup" && (
            <GlassInput
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <GlassInput
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <GlassInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === "signup" && (
            <GlassInput
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <GlassButton
            type="submit"
            className="w-full mt-4 glow"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </GlassButton>

          {error && (
            <p className="text-sm text-red-400 text-center mt-2">{error}</p>
          )}
        </form>

        <div className="my-4 text-center text-sm text-gray-400">or</div>

        <div className="flex justify-center gap-4">
          <GlassButton type="button" onClick={() => handleOAuth("google")}>
            Sign in with Google
          </GlassButton>
          <GlassButton type="button" onClick={() => handleOAuth("github")}>
            GitHub
          </GlassButton>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          {mode === "login" ? "Don't have an account?" : "Already a user?"}{" "}
          <button
            onClick={toggleMode}
            className="text-primary font-medium hover:underline transition-all"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert interviewer. Generate a list of 6 short, relevant and varied interview questions tailored for a candidate interviewing for the following role.",
          },
          {
            role: "user",
            content: `Role: ${role}. Generate exactly 6 questions in bullet points.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();
    console.log("GROQ Response:", data);

    const message = data?.choices?.[0]?.message?.content;

    if (message) {
      const questions = message
        .split("\n")
        .filter((q) => q.trim())
        .map((q) => q.replace(/^\d+[\.\)]?\s*/, "").replace(/^[-*]\s*/, "")); // remove bullets or numbers

      return NextResponse.json({ questions });
    }

    return NextResponse.json({ error: "No content returned" }, { status: 500 });
  } catch (err) {
    console.error("GROQ Error:", err);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}

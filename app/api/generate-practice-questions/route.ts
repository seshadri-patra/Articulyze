import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
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
            content: `You're a conversation coach. Generate 6 short practice questions for this category.`,
          },
          {
            role: "user",
            content: `Generate 6 clear, varied questions for the "${category}" conversation mode.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();

    const message = data?.choices?.[0]?.message?.content;

    if (message) {
        const questions = message
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => /^[\d\-*]/.test(q)) // only lines that look like questions
        .map((q) =>
          q.replace(/^\d+[\.\)]?\s*/, "") // remove number or bullet
           .replace(/^[-*]\s*/, "") // remove dash or star bullet
           .trim()
        );

      return NextResponse.json({ questions });
    }

    return NextResponse.json({ error: "No content returned" }, { status: 500 });
  } catch (err) {
    console.error("GROQ Error:", err);
    return NextResponse.json({ error: "Failed to generate practice questions" }, { status: 500 });
  }
}

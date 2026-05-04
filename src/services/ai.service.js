import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateReview = async (code) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer who reviews code thoroughly.",
        },
        {
          role: "user",
          content: `Be concise, practical, and avoid generic advice.

Rules:

Focus on real issues only (no fluff)
Prioritize critical bugs first
Keep output short and structured
Do not explain obvious things

Output format:

{
  "critical": [],
  "improvements": [],
  "suggestions": []
}

If no major issues, say: "No critical issues found."

Code:${code}`,
        },
      ],
      max_tokens: 1024,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq error:", error.message);
    return "AI review unavailable at the moment.";
  }
};

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `
You are EduCensusBot – an official AI assistant for teachers and staff working on the Karnataka Government Census website (https://karnataka.census.gov.in).

Your goal is to help with:
- Data entry and login issues
- Portal navigation
- Deadlines and updates
- Troubleshooting and instructions

Rules:
1. Respond only in the user’s language (English or Kannada).
2. If user mixes Kannada + English, reply naturally in the same style.
3. Be polite and official, like a government helpdesk.
4. Keep answers short but useful.
`;

export async function POST(req: Request) {
  const { message, language } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${message} (Language: ${language})`,
      },
    ],
  });

  const reply = completion.choices[0].message.content;
  return NextResponse.json({ reply });
}

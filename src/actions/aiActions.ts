"use server";

export async function getAISummary(title: string, overview: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error("Missing Gemini API Key");
    return "API Key is missing. Check .env.local and restart server.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `Write a short, engaging, and spoiler-free summary for the movie "${title}". Here is the plot overview to base it on: ${overview}. Keep it under 3 sentences and make it sound like a professional movie critic.`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return `API Error: ${data.error?.message || 'Check terminal for details'}`;
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Action Error:", error);
    return "Failed to generate AI summary at this time.";
  }
}
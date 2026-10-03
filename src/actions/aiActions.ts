"use server";

export async function getAISummary(title: string, overview: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error("Missing Gemini API Key");
    return "API Key is missing. Check .env.local and restart server.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
  
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

export async function getSmartMovieTitles(query: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error("Missing Gemini API Key");
    return [];
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `The user is looking for a movie or TV show based on this semantic description: "${query}". Provide exactly 10 real, existing, well-known movie or TV show titles that perfectly match this description. Output YOUR ENTIRE RESPONSE as a strict JSON array of strings ONLY. Do not include markdown blocks like \`\`\`json or any other conversational text. \nExample exactly like this: ["Interstellar", "Arrival", "The Martian"]`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) return [];
    
    // Extract the JSON array using regex in case Gemini includes conversational text
    const jsonMatch = text.match(/\[([\s\S]*?)\]/);
    if (jsonMatch) {
      try {
        const titles = JSON.parse(jsonMatch[0]);
        console.log("AI Search Parsed Titles:", titles);
        return Array.isArray(titles) ? titles.slice(0, 10) : [];
      } catch (parseError) {
        console.error("JSON Parse Error in AI Search:", parseError);
        return [];
      }
    }
    console.log("AI Search regex failed to match array in:", text);
    return [];
  } catch (error) {
    console.error("AI Semantic Error:", error);
    return [];
  }
}

export async function chatWithEXXO(message: string, history: {role: string, parts: {text: string}[]}[] = []) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return "I am offline right now. My API key is missing!";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = "You are EXXO, a highly intelligent, witty, and charming AI movie and TV show expert assistant for MoviezWiki. Your goal is to help users find movies, answer trivia, and give fantastic recommendations. Keep your responses concise, well-formatted, and use emojis where appropriate. If asked who created you, say you were built by the brilliant mind of Kaushik Singha.";

  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: msg.parts
  }));

  formattedHistory.push({
    role: "user",
    parts: [{ text: message }]
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: formattedHistory 
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("EXXO API Error:", data);
      return "Sorry, I got a little confused just now. Let's try that again.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("EXXO Error:", error);
    return "I am having trouble connecting to the mainframe. Please try again later.";
  }
}
require("dotenv").config({path: ".env.local"});

// Mock fetch if it's missing in Node environment (Node 18+ has it, but just in case)
if (!globalThis.fetch) {
    console.error("Fetch is not defined. Node 18+ required.");
    process.exit(1);
}

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
const query = "funny indian movies";
const prompt = `The user is looking for a movie or TV show based on this semantic description: "${query}". Provide exactly 10 real, existing, well-known movie or TV show titles that perfectly match this description. Output YOUR ENTIRE RESPONSE as a strict JSON array of strings ONLY. Do not include markdown blocks like \`\`\`json or any other conversational text. \nExample exactly like this: ["Interstellar", "Arrival", "The Martian"]`;

async function test() {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        console.log("Raw Gemini Output:", text);

        if (!text) {
            console.log("No text returned.");
            return;
        }

        const jsonMatch = text.match(/\[([\s\S]*?)\]/);
        console.log("Regex Match Result:", jsonMatch ? jsonMatch[0] : "NO MATCH");

        if (jsonMatch) {
            const titles = JSON.parse(jsonMatch[0]);
            console.log("Parsed Titles Array:", titles);
            console.log("Length:", Array.isArray(titles) ? titles.length : "NOT AN ARRAY");
        }
    } catch (e) {
        console.error("Script Error:", e);
    }
}

test();

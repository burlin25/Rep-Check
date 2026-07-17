import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Route for Gemini AI gym bro caption generation
app.post("/api/gemini/caption", async (req, res) => {
  try {
    const { hashtag, weight, reps, sets, milestones } = req.body;
    
    // Construct rich context for the funny caption
    const milestoneStr = milestones && milestones.length > 0 
      ? `Highlights reached: ${milestones.join(", ")}` 
      : "";
    
    const prompt = `Write a hilarious, lighthearted, and witty "gym bro" styled caption for a social lifting check-in.
Details of the lift:
- Hashtag / Focused Muscle: ${hashtag || "#general"}
- Active metrics: ${weight || 0} lbs for ${reps || 0} reps across ${sets || 0} sets.
- Special details: ${milestoneStr || "None"}

The tone must be pure elite gym bro satire (references to pre-workout, creatine dry scoops, anabolic window, smelling salts, getting absolutely jacked, light-weight baby, plate math, or biceps size). Make it brief (1-3 lines), funny, and highly readable. Do not use corporate, polite, or explanatory language. Just return the caption raw, without any quotation marks or intro text. Add 1-2 appropriate gym emojis.`;

    const ai = getAiClient();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    const jokeText = result.text || "Just crushed some heavy weight. The gains are real. No excuses. 🏋️‍♂️💪";
    res.json({ joke: jokeText.trim().replace(/^"|"$/g, '') });
  } catch (error: any) {
    console.error("Gemini caption error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI Coach caption." });
  }
});

async function startServer() {
  // Vite middleware for development (Express v4 format setup)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

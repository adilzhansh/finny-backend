import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Путь будет просто /api/server
app.post('/api/server', async (req, res) => {
  const { message } = req.body;
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ты — финансовый ментор Финни. Давай только образовательные советы." },
        { role: "user", content: message }
      ],
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка");
  }
});

export default app;
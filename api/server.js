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

// Для Vercel путь должен совпадать с названием файла в папке api
app.post('/api/server', async (req, res) => {
  const { message } = req.body;
  
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).send("Ошибка: Ключ API не найден в настройках Vercel");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ты — финансовый ментор Финни. Давай короткие советы." },
        { role: "user", content: message }
      ],
    });

    res.status(200).send(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка OpenAI: " + error.message);
  }
});

export default app;
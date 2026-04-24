import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http'; // Новый импорт

dotenv.config();

const app = express();
const router = express.Router(); // Используем роутер для Netlify

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Все пути теперь будут начинаться с /.netlify/functions/server
router.post('/chat', async (req, res) => {
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

app.use('/.netlify/functions/server', router);

export const handler = serverless(app); // Экспортируем для Netlify

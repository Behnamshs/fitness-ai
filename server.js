const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/ping", (req, res) => res.json({ ok: true }));

app.post("/api/workout", async (req, res) => {
  try {
    const { height, weight, gender, goal } = req.body || {};
    if (!height || !weight || !gender || !goal) {
      return res.status(400).json({ error: "height, weight, gender, goal required" });
    }

    const prompt = `کاربر با مشخصات زیر یک برنامه تمرینی ۵ جلسه‌ای می‌خواهد. 
- قد: ${height} سانتی‌متر
- وزن: ${weight} کیلوگرم
- جنسیت: ${gender}
- هدف: ${goal}

لطفاً یک **برنامه ۵ جلسه‌ای باشگاهی** تولید کن. برای هر جلسه:
1) یک تیتر با تگ H1 که عنوان روز را نشان می‌دهد (مثلاً "<h1>روز سینه</h1>")
2) زیر آن یک لیست با تگ <ul> حاوی 3 تا 6 حرکت مشخص به شکل "<li>نام حرکت — ست × تکرار — توضیح کوتاه</li>"
3) اگر لازم است نکات ایمنی/گرم کردن در یک پاراگراف کوتاه زیر هر لیست بیاور.
4) خروجی را **کاملاً** به صورت HTML (با تگ‌های h1, ul, li, p) بده تا مستقیماً در فرانت قرار بگیرد.`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server missing OPENAI_API_KEY in environment" });
    }

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "شما یک مربی بدنسازی حرفه‌ای و دقیق هستید. خروجی HTML محور و قابل نمایش بده." },
        { role: "user", content: prompt }
      ],
      max_tokens: 900,
      temperature: 0.7
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const plan = response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content;
    if (!plan) {
      return res.status(500).json({ error: "No plan returned from OpenAI" });
    }

    res.json({ plan });
  } catch (err) {
    console.error("Error /api/workout:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "Failed to generate plan", details: err.response ? err.response.data : err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
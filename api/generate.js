import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { gender, height, weight } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
    کاربر با مشخصات زیر برنامه تمرینی می‌خواهد:
    - جنسیت: ${gender}
    - قد: ${height} سانتی‌متر
    - وزن: ${weight} کیلوگرم

    یک برنامه ۵ جلسه‌ای بدنسازی بنویس. برای هر روز با h1 اسم روز (مثلاً روز سینه)
    و زیرش لیست تمرین‌ها با توضیح کوتاه بده.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      plan: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate plan" });
  }
}
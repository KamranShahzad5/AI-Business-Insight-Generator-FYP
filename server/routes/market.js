const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// ── Helper: get a verified Groq client (free tier at console.groq.com) ────────
const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.includes('your_actual') || key.trim() === '') {
    throw new Error(
      'GROQ_API_KEY is missing or still set to the placeholder. ' +
      'Open backend/.env and set it to your real Groq API key from https://console.groq.com/'
    );
  }
  return new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

const cleanJSON = (text) => {
  let t = text.trim();
  t = t.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return t.trim();
};

// POST /api/market/research
// Generates market research data for a business idea using Groq
router.post('/research', async (req, res) => {
  try {
    const { idea, industry, budget } = req.body;

    if (!idea || idea.trim().length < 10) {
      return res.status(400).json({ msg: 'Please provide a business idea.' });
    }

    const client = getGroqClient();

    const prompt = `You are a professional market research analyst. 
Research the market for this business idea and provide data-driven insights.

Business Idea: "${idea}"
Industry: ${industry}
Budget: PKR ${budget}

Use your knowledge to provide current, realistic market data. Target location assumptions should focus primarily on Pakistan. Return ONLY a valid JSON object with NO markdown, no backticks:

{
  "marketSize": {
    "current": "e.g. PKR 12 Billion (2024)",
    "projected": "e.g. PKR 25 Billion (2029)",
    "cagr": "e.g. 18.4%",
    "source": "Estimated based on industry trends"
  },
  "trends": [
    {
      "title": "Trend name",
      "description": "What this trend means for the business",
      "impact": "High",
      "direction": "up"
    }
  ],
  "competitors": [
    {
      "name": "Real competitor company name",
      "description": "What they do",
      "marketShare": "e.g. 23%",
      "strengths": "Key strength",
      "weakness": "Key weakness",
      "website": "e.g. competitor.com"
    }
  ],
  "targetAudience": {
    "primarySegment": "Who is the main customer",
    "ageRange": "e.g. 25-45",
    "location": "e.g. Pakistan (or major cities like Karachi, Lahore, Islamabad)",
    "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
    "buyingBehavior": "How they make purchase decisions"
  },
  "swot": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Threat 1", "Threat 2"]
  },
  "entryBarriers": [
    { "barrier": "Barrier name", "severity": "High", "howToOvercome": "Strategy" }
  ],
  "regulatoryNotes": "Any key regulations or compliance requirements for this industry",
  "researchSummary": "A 2-3 sentence executive summary of the market opportunity"
}

Provide exactly 4 trends, 4-5 real competitors, 3 entry barriers. Use real company names as competitors.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const rawText = completion.choices[0]?.message?.content || '';

    if (!rawText || rawText.trim().length === 0) {
      return res.status(500).json({ msg: 'AI returned empty response. Try again.' });
    }

    let data;
    try {
      data = JSON.parse(cleanJSON(rawText));
    } catch (e) {
      console.error('Market research JSON parse error:', rawText.slice(0, 400));
      return res.status(500).json({ msg: 'AI returned malformed data. Please try again.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Market Research Error:', err);
    if (err.status === 401 || err.message.includes('401')) {
      return res.status(401).json({ msg: 'Invalid Groq API key. Update backend/.env' });
    }
    if (err.status === 429 || err.message.includes('429')) {
      return res.status(429).json({ msg: 'Groq quota exceeded. Wait a moment and try again.' });
    }
    res.status(500).json({ msg: err.message || 'Error fetching market research' });
  }
});

module.exports = router;

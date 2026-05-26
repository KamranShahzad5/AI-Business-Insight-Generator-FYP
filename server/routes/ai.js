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

// ── Helper: strip markdown fences from AI output ─────────────────────────────
const cleanJSON = (text) => {
  let t = text.trim();
  // Remove ```json ... ``` or ``` ... ```
  t = t.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  return t.trim();
};

// ── POST /api/ai/generate ───────────────────────────────────────────────────
// Generates a full business plan (tasks, costs, risks, business plan sections)
router.post('/generate', async (req, res) => {
  try {
    const { idea, industry, budget } = req.body;

    if (!idea || idea.trim().length < 10) {
      return res.status(400).json({ msg: 'Please provide a meaningful business idea (at least 10 characters).' });
    }

    const client = getGroqClient();

    const prompt = `You are an expert AI business advisor and startup consultant.
Generate a comprehensive business plan for the following business idea.

Idea: "${idea}"
Industry: ${industry}
Budget: PKR ${budget}

CRITICAL RULES:
- All tasks and risks MUST be highly specific to the given idea — no generic filler.
- For software/app/SaaS ideas: include technical phases (Architecture, Frontend, Backend API, QA/SQA, CI/CD, Security Audit, etc.).
- For physical/traditional businesses (restaurant, car rental, retail): include operational tasks (location scouting, licensing, inventory, staff hiring, local marketing, insurance) — NO software development tasks.
- All monetary values must be realistic numbers in Pakistani Rupees (PKR) based on the given budget of PKR ${budget}. Do not use dollar signs ($) in descriptions; represent all calculations as integers in PKR.

Return ONLY a valid JSON object — no markdown, no backticks, no explanation before or after. Just the raw JSON:

{
  "title": "A short catchy venture name",
  "businessPlan": {
    "executiveSummary": "...",
    "marketAnalysis": "...",
    "productDescription": "...",
    "marketingStrategy": "...",
    "operationsPlan": "...",
    "financialOverview": "..."
  },
  "tasks": [
    {
      "id": "task-1",
      "name": "...",
      "desc": "...",
      "duration": "...",
      "priority": "High",
      "owner": "...",
      "status": "Todo"
    }
  ],
  "costEstimates": {
    "startup": {
      "development": 0,
      "design": 0,
      "marketing": 0,
      "legal": 0,
      "infrastructure": 0,
      "miscellaneous": 0
    },
    "monthly": {
      "salaries": 0,
      "hosting": 0,
      "marketing": 0,
      "tools": 0,
      "support": 0
    },
    "timeToRevenue": "X months",
    "breakEvenMonth": 12,
    "year1Revenue": 0,
    "year2Revenue": 0,
    "year3Revenue": 0
  },
  "risks": [
    {
      "id": "risk-1",
      "name": "...",
      "category": "Market",
      "desc": "...",
      "severity": "High",
      "likelihood": "Medium",
      "mitigation": "..."
    }
  ]
}

Generate exactly 10-12 tasks and exactly 6-8 risks, all highly specific to the idea above.`;

    console.log('--- Calling Groq API ---');
    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    console.log('--- Groq API Success ---');

    const rawText = completion.choices[0]?.message?.content || '';

    if (!rawText || rawText.trim().length === 0) {
      return res.status(500).json({ msg: 'Groq returned an empty response. Check your API key at https://console.groq.com/' });
    }

    let aiData;
    try {
      aiData = JSON.parse(cleanJSON(rawText));
    } catch (parseErr) {
      console.error('JSON parse error. Raw Grok response:\n', rawText.slice(0, 500));
      return res.status(500).json({
        msg: 'AI returned malformed JSON. This can happen with complex prompts — please try again.',
      });
    }

    // Validate required fields exist
    if (!aiData.title || !aiData.businessPlan || !aiData.tasks || !aiData.costEstimates || !aiData.risks) {
      return res.status(500).json({ msg: 'AI response was incomplete. Please try again.' });
    }

    res.json(aiData);
  } catch (err) {
    console.error('Groq Generation Error:', err);
    
    if (err.status === 403 || err.message.includes('403')) {
      return res.status(403).json({ msg: 'Groq API Access Denied. Details: ' + (err.error?.message || err.message) });
    }
    if (err.status === 401 || err.message.includes('401')) {
      return res.status(401).json({ msg: 'Invalid Groq API Key.' });
    }
    
    res.status(500).json({ msg: err.message || 'Error generating AI plan' });
  }
});

// ── POST /api/ai/chat ───────────────────────────────────────────────────────
// Generates a contextual chat reply about the user's specific plan
router.post('/chat', async (req, res) => {
  try {
    const { message, planContext } = req.body;

    if (!message || !planContext) {
      return res.status(400).json({ msg: 'message and planContext are required.' });
    }

    const client = getGroqClient();

    const prompt = `You are an expert AI business advisor helping the founder of "${planContext.title}".

Business Idea: ${planContext.idea}
Industry: ${planContext.industry}

Generated Plan Summary:
- Cost Estimates: ${JSON.stringify(planContext.costEstimates)}
- Top Risks: ${JSON.stringify((planContext.risks || []).map((r) => r.name))}
- Tasks: ${JSON.stringify((planContext.tasks || []).map((t) => t.name))}

User Question: "${message}"

Instructions:
- Give a specific, professional, and concise answer.
- Reference exact numbers, task names, or risks from the plan data above when relevant.
- Use markdown for formatting (bullet points, bold for key terms).
- Do NOT give generic startup advice that ignores the plan data.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || '';

    if (!reply || reply.trim().length === 0) {
      return res.status(500).json({ msg: 'AI returned an empty reply. Please try again.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err.message);

    if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('API key') || err.message.includes('Invalid API Key')) {
      return res.status(401).json({ msg: 'Invalid Groq API key. Update GROQ_API_KEY in backend/.env' });
    }
    if (err.message.includes('429') || err.message.includes('rate limit') || err.message.includes('Rate limit')) {
      return res.status(429).json({ msg: 'Groq API rate limit reached. Try again in a moment.' });
    }

    res.status(500).json({ msg: err.message || 'Error generating chat reply' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.includes('your_actual') || key.trim() === '') {
    throw new Error('GROQ_API_KEY is missing or invalid.');
  }
  return new OpenAI({
    apiKey: key,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

const cleanJSON = (text) => {
  let t = text.trim();
  t = t.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/g, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return t.trim();
};

const parseWithRetry = async (client, messages, attempt = 1) => {
  const completion = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    temperature: attempt === 1 ? 0.7 : 0.3,
    max_tokens: 2500,
  });

  const rawText = completion.choices[0]?.message?.content || '';

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('AI returned an empty response.');
  }

  try {
    return JSON.parse(cleanJSON(rawText));
  } catch (e) {
    if (attempt < 3) {
      console.log(`JSON parse failed on attempt ${attempt}, retrying...`);
      messages.push({ role: 'assistant', content: rawText });
      messages.push({
        role: 'user',
        content: 'Your response contained invalid JSON. Return ONLY the corrected valid JSON object with no markdown, no backticks, no explanation. Just the raw JSON starting with { and ending with }.',
      });
      return parseWithRetry(client, messages, attempt + 1);
    }
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    console.error('All parse attempts failed. Raw:', rawText.slice(0, 500));
    throw new Error('AI returned malformed JSON after 3 attempts. Please try again.');
  }
};

// ── POST /api/ai/generate ───────────────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { idea, industry, budget } = req.body;

    if (!idea || idea.trim().length < 10) {
      return res.status(400).json({ msg: 'Please provide a meaningful business idea (at least 10 characters).' });
    }

    const client = getGroqClient();

    const prompt = `You are an expert AI business advisor. Return ONLY a valid JSON object, no markdown, no backticks.

Idea: "${idea}"
Industry: ${industry}
Budget: PKR ${budget}

Rules:
- All money as integers in PKR
- Exactly 10 tasks, exactly 6 risks
- Specific to the idea above

{
  "title": "Short business name",
  "businessPlan": {
    "executiveSummary": "3 sentences",
    "marketAnalysis": "3 sentences",
    "productDescription": "3 sentences",
    "marketingStrategy": "3 sentences",
    "operationsPlan": "3 sentences",
    "financialOverview": "3 sentences"
  },
  "tasks": [
    { "id": "task-1", "name": "", "desc": "", "duration": "", "priority": "High", "owner": "", "status": "Todo" },
    { "id": "task-2", "name": "", "desc": "", "duration": "", "priority": "Medium", "owner": "", "status": "Todo" },
    { "id": "task-3", "name": "", "desc": "", "duration": "", "priority": "High", "owner": "", "status": "Todo" },
    { "id": "task-4", "name": "", "desc": "", "duration": "", "priority": "Low", "owner": "", "status": "Todo" },
    { "id": "task-5", "name": "", "desc": "", "duration": "", "priority": "High", "owner": "", "status": "Todo" },
    { "id": "task-6", "name": "", "desc": "", "duration": "", "priority": "Medium", "owner": "", "status": "Todo" },
    { "id": "task-7", "name": "", "desc": "", "duration": "", "priority": "High", "owner": "", "status": "Todo" },
    { "id": "task-8", "name": "", "desc": "", "duration": "", "priority": "Medium", "owner": "", "status": "Todo" },
    { "id": "task-9", "name": "", "desc": "", "duration": "", "priority": "Low", "owner": "", "status": "Todo" },
    { "id": "task-10", "name": "", "desc": "", "duration": "", "priority": "High", "owner": "", "status": "Todo" }
  ],
  "costEstimates": {
    "startup": { "development": 0, "design": 0, "marketing": 0, "legal": 0, "infrastructure": 0, "miscellaneous": 0 },
    "monthly": { "salaries": 0, "hosting": 0, "marketing": 0, "tools": 0, "support": 0 },
    "timeToRevenue": "3 months",
    "breakEvenMonth": 12,
    "year1Revenue": 0,
    "year2Revenue": 0,
    "year3Revenue": 0
  },
  "risks": [
    { "id": "risk-1", "name": "", "category": "Market", "desc": "", "severity": "High", "likelihood": "Medium", "mitigation": "" },
    { "id": "risk-2", "name": "", "category": "Financial", "desc": "", "severity": "Medium", "likelihood": "High", "mitigation": "" },
    { "id": "risk-3", "name": "", "category": "Operational", "desc": "", "severity": "High", "likelihood": "Low", "mitigation": "" },
    { "id": "risk-4", "name": "", "category": "Legal", "desc": "", "severity": "Medium", "likelihood": "Medium", "mitigation": "" },
    { "id": "risk-5", "name": "", "category": "Market", "desc": "", "severity": "Low", "likelihood": "High", "mitigation": "" },
    { "id": "risk-6", "name": "", "category": "Operational", "desc": "", "severity": "High", "likelihood": "Medium", "mitigation": "" }
  ]
}`;

    const messages = [{ role: 'user', content: prompt }];
    const aiData = await parseWithRetry(client, messages);

    if (!aiData.title || !aiData.businessPlan || !aiData.tasks || !aiData.costEstimates || !aiData.risks) {
      return res.status(500).json({ msg: 'AI response was incomplete. Please try again.' });
    }

    res.json(aiData);
  } catch (err) {
    console.error('Groq Generation Error:', err.message);
    if (err.status === 403 || (err.message && err.message.includes('403'))) {
      return res.status(403).json({ msg: 'Groq API access denied: ' + err.message });
    }
    if (err.status === 401 || (err.message && err.message.includes('401'))) {
      return res.status(401).json({ msg: 'Invalid Groq API Key.' });
    }
    if (err.status === 429 || (err.message && err.message.includes('429'))) {
      return res.status(429).json({ msg: 'Groq rate limit reached. Please wait a moment and try again.' });
    }
    res.status(500).json({ msg: err.message || 'Error generating AI plan' });
  }
});

// ── POST /api/ai/chat ───────────────────────────────────────────────────────
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

Plan Summary:
- Cost Estimates: ${JSON.stringify(planContext.costEstimates)}
- Top Risks: ${JSON.stringify((planContext.risks || []).map(r => r.name))}
- Tasks: ${JSON.stringify((planContext.tasks || []).map(t => t.name))}

User Question: "${message}"

Instructions:
- Give a specific, professional, and concise answer.
- Reference exact numbers, task names, or risks from the plan when relevant.
- Use markdown for formatting (bullet points, bold for key terms).
- Do NOT give generic advice that ignores the plan data.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || '';

    if (!reply || reply.trim().length === 0) {
      return res.status(500).json({ msg: 'AI returned an empty reply. Please try again.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err.message);
    if (err.message.includes('401') || err.message.includes('API key')) {
      return res.status(401).json({ msg: 'Invalid Groq API key.' });
    }
    if (err.message.includes('429') || err.message.includes('rate limit')) {
      return res.status(429).json({ msg: 'Groq rate limit reached. Try again in a moment.' });
    }
    res.status(500).json({ msg: err.message || 'Error generating chat reply' });
  }
});

module.exports = router;

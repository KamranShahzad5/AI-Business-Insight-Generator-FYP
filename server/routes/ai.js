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
    temperature: attempt === 1 ? 0.7 : 0.3, // lower temp on retry
    max_tokens: 4000,
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
      // Add a message asking to fix the JSON
      messages.push({ role: 'assistant', content: rawText });
      messages.push({
        role: 'user',
        content: 'Your response contained invalid JSON. Return ONLY the corrected valid JSON object with no markdown, no backticks, no explanation. Just the raw JSON starting with { and ending with }.'
      });
      return parseWithRetry(client, messages, attempt + 1);
    }
    // Last attempt: try regex extraction
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
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

    const prompt = `You are an expert AI business advisor. Generate a business plan as a single valid JSON object.

BUSINESS IDEA: "${idea}"
INDUSTRY: ${industry}
BUDGET: PKR ${budget}

STRICT RULES:
1. Return ONLY raw JSON — no markdown, no backticks, no text before or after
2. All money values must be integers in PKR (no dollar signs)
3. Tasks and risks must be specific to the idea above
4. Generate exactly 10 tasks and exactly 6 risks
5. Every string value must use straight quotes and no unescaped special characters

JSON STRUCTURE (follow exactly):
{
  "title": "Short catchy business name",
  "businessPlan": {
    "executiveSummary": "3-4 sentences about the business",
    "marketAnalysis": "3-4 sentences about the market",
    "productDescription": "3-4 sentences about the product/service",
    "marketingStrategy": "3-4 sentences about marketing",
    "operationsPlan": "3-4 sentences about operations",
    "financialOverview": "3-4 sentences about financials"
  },
  "tasks": [
    { "id": "task-1", "name": "Task name", "desc": "Task description", "duration": "2 weeks", "priority": "High", "owner": "Founder", "status": "Todo" },
    { "id": "task-2", "name": "Task name", "desc": "Task description", "duration": "1 week", "priority": "Medium", "owner": "Manager", "status": "Todo" },
    { "id": "task-3", "name": "Task name", "desc": "Task description", "duration": "3 weeks", "priority": "High", "owner": "Founder", "status": "Todo" },
    { "id": "task-4", "name": "Task name", "desc": "Task description", "duration": "2 weeks", "priority": "Low", "owner": "Team", "status": "Todo" },
    { "id": "task-5", "name": "Task name", "desc": "Task description", "duration": "1 week", "priority": "High", "owner": "Founder", "status": "Todo" },
    { "id": "task-6", "name": "Task name", "desc": "Task description", "duration": "2 weeks", "priority": "Medium", "owner": "Manager", "status": "Todo" },
    { "id": "task-7", "name": "Task name", "desc": "Task description", "duration": "1 week", "priority": "High", "owner": "Founder", "status": "Todo" },
    { "id": "task-8", "name": "Task name", "desc": "Task description", "duration": "3 weeks", "priority": "Medium", "owner": "Team", "status": "Todo" },
    { "id": "task-9", "name": "Task name", "desc": "Task description", "duration": "2 weeks", "priority": "Low", "owner": "Manager", "status": "Todo" },
    { "id": "task-10", "name": "Task name", "desc": "Task description", "duration": "1 week", "priority": "High", "owner": "Founder", "status": "Todo" }
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
    "timeToRevenue": "3 months",
    "breakEvenMonth": 12,
    "year1Revenue": 0,
    "year2Revenue": 0,
    "year3Revenue": 0
  },
  "risks": [
    { "id": "risk-1", "name": "Risk name", "category": "Market", "desc": "Risk description", "severity": "High", "likelihood": "Medium", "mitigation": "Mitigation strategy" },
    { "id": "risk-2", "name": "Risk name", "category": "Financial", "desc": "Risk description", "severity": "Medium", "likelihood": "High", "mitigation": "Mitigation strategy" },
    { "id": "risk-3", "name": "Risk name", "category": "Operational", "desc": "Risk description", "severity": "High", "likelihood": "Low", "mitigation": "Mitigation strategy" },
    { "id": "risk-4", "name": "Risk name", "category": "Legal", "desc": "Risk description", "severity": "Medium", "likelihood": "Medium", "mitigation": "Mitigation strategy" },
    { "id": "risk-5", "name": "Risk name", "category": "Market", "desc": "Risk description", "severity": "Low", "likelihood": "High", "mitigation": "Mitigation strategy" },
    { "id": "risk-6", "name": "Risk name", "category": "Operational", "desc": "Risk description", "severity": "High", "likelihood": "Medium", "mitigation": "Mitigation strategy" }
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

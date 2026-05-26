import { api } from './api';

// ─── Full Plan Generator (Backend → Gemini API) ─────────────────────────────
// This is the PRIMARY entry point called from NewPlan.jsx
export async function generateFullPlan(idea, industry, budget) {
  // Call the backend which calls Gemini
  const aiData = await api.generateAIPlan(idea, industry, budget);

  // Validate the response has all required fields
  if (!aiData || !aiData.title) {
    throw new Error('AI returned an incomplete plan. Please try again.');
  }

  return {
    id: crypto.randomUUID(),
    title: aiData.title,
    idea,
    industry,
    budget,
    createdAt: new Date().toISOString(),
    businessPlan: aiData.businessPlan,
    tasks: aiData.tasks,
    costEstimates: aiData.costEstimates,
    risks: aiData.risks,
    chatHistory: [],
  };
}

// ─── AI Chat Reply (Backend → Gemini API) ──────────────────────────────────
export async function generateAIReply(message, plan) {
  const res = await api.generateAIChat(message, plan);
  return res.reply;
}

// ─── Utility: Plan Title (fallback only, not used in main flow) ─────────────
export function generatePlanTitle(idea) {
  const words = idea.trim().split(/\s+/);
  const meaningful = words.filter((w) => w.length > 3).slice(0, 4);
  if (meaningful.length < 2) return `Business Plan: ${idea.slice(0, 40)}`;
  return meaningful.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Venture';
}

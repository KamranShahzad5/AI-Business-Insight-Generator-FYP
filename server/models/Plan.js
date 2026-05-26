const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  idea: { type: String, required: true },
  industry: { type: String, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  businessPlan: { type: Object, required: true },
  tasks: { type: Array, required: true },
  costEstimates: { type: Object, required: true },
  risks: { type: Array, required: true },
  chatHistory: { type: Array, default: [] },
});

module.exports = mongoose.model('Plan', PlanSchema);

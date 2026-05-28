const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Plan = require('../models/Plan');

// @route   GET api/plans
// @desc    Get all user's plans
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user.id }).sort({ createdAt: -1 });
    const plansResponse = plans.map(plan => {
      const p = plan.toObject();
      p.id = p._id.toString();
      delete p._id;
      return p;
    });
    res.json(plansResponse);
  } catch (err) {
    console.error(err.message);
    // ✅ FIXED: was res.status(500).send('Server Error') — plain text breaks .json()
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/plans
// @desc    Add new plan
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newPlan = new Plan({
      ...req.body,
      user: req.user.id,
    });
    const plan = await newPlan.save();
    const planResponse = plan.toObject();
    planResponse.id = planResponse._id.toString();
    delete planResponse._id;
    res.json(planResponse);
  } catch (err) {
    console.error(err.message);
    // ✅ FIXED
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/plans/:id
// @desc    Update plan
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });
    if (plan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    const planResponse = plan.toObject();
    planResponse.id = planResponse._id.toString();
    delete planResponse._id;
    res.json(planResponse);
  } catch (err) {
    console.error(err.message);
    // ✅ FIXED
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/plans/:id
// @desc    Delete plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });
    if (plan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Plan removed' });
  } catch (err) {
    console.error(err.message);
    // ✅ FIXED
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

import express from 'express';
import User from '../models/User';
import Assignment from '../models/Assignment';
import mongoose from 'mongoose';

const router = express.Router();

// List all engineers
router.get('/', async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' }).select('-password');
    res.json(engineers);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get engineer capacity
router.get('/:id/capacity', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid engineer ID' });

    const engineer = await User.findById(id);
    if (!engineer || engineer.role !== 'engineer') return res.status(404).json({ message: 'Engineer not found' });

    const now = new Date();

    const assignments = await Assignment.find({
      engineerId: id,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const allocated = assignments.reduce((total, a) => total + a.allocationPercentage, 0);
    const available = (engineer.maxCapacity || 100) - allocated;

    res.json({ maxCapacity: engineer.maxCapacity || 100, allocated, available });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
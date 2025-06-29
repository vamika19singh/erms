import express from 'express';
import Assignment from '../models/Assignment';
import User from '../models/User';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  const { engineerId, projectId } = req.query;

  let filter: any = {};
  if (engineerId && mongoose.Types.ObjectId.isValid(engineerId as string)) filter.engineerId = engineerId;
  if (projectId && mongoose.Types.ObjectId.isValid(projectId as string)) filter.projectId = projectId;

  try {
    const assignments = await Assignment.find(filter)
      .populate('engineerId', 'name skills seniority maxCapacity')
      .populate('projectId', 'name status');
    res.json(assignments);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'manager') return res.status(403).json({ message: 'Only managers can create assignments' });

  const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;

  if (!engineerId || !projectId || allocationPercentage === undefined || !startDate || !endDate)
    return res.status(400).json({ message: 'Missing required fields' });

  if (!mongoose.Types.ObjectId.isValid(engineerId) || !mongoose.Types.ObjectId.isValid(projectId))
    return res.status(400).json({ message: 'Invalid engineer or project ID' });

  try {
    const engineer = await User.findById(engineerId);
    if (!engineer) return res.status(404).json({ message: 'Engineer not found' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return res.status(400).json({ message: 'End date must be after start date' });

    // Check for overlapping assignments capacity
    const overlappingAssignments = await Assignment.find({
      engineerId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }]
    });

    const allocatedPercent = overlappingAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    if (allocatedPercent + allocationPercentage > (engineer.maxCapacity || 100))
      return res.status(400).json({ message: 'Engineer capacity exceeded' });

    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role: role || 'Developer'
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'manager') return res.status(403).json({ message: 'Only managers can update assignments' });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid assignment ID' });

  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const { allocationPercentage, startDate, endDate, role } = req.body;
    if (allocationPercentage !== undefined) assignment.allocationPercentage = allocationPercentage;
    if (startDate) assignment.startDate = new Date(startDate);
    if (endDate) assignment.endDate = new Date(endDate);
    if (role) assignment.role = role;

    // TODO: Add capacity validation here (optional)

    await assignment.save();
    res.json(assignment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'manager') return res.status(403).json({ message: 'Only managers can delete assignments' });

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid assignment ID' });

  try {
    await Assignment.findByIdAndDelete(id);
    res.json({ message: 'Assignment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
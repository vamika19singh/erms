import express from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    let query = {};
    if (status && ['planning', 'active', 'completed'].includes(status)) {
      query = { status };
    }
    const projects = await Project.find(query);
    res.json(projects);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid project ID' });

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  if (req.user?.role !== 'manager') return res.status(403).json({ message: 'Only managers can create projects' });

  const { name, description, startDate, endDate, requiredSkills, teamSize, status } = req.body;

  if (!name || !startDate || !endDate || !teamSize) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      requiredSkills,
      teamSize,
      status: status || 'planning',
      managerId: req.user.id
    });
    await project.save();
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
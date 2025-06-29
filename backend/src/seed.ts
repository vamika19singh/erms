import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from './models/User';
import Project from './models/Project';
import Assignment from './models/Assignment';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/erm';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Project.deleteMany({});
  await Assignment.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  // --- Engineers ---
  const engineers = [
    {
      email: 'alice@company.com',
      password: await bcrypt.hash('password', salt),
      name: 'Alice',
      role: 'engineer',
      skills: ['React', 'Node.js', 'Python'],
      seniority: 'senior',
      maxCapacity: 100,
      department: 'Frontend'
    },
    {
      email: 'bob@company.com',
      password: await bcrypt.hash('password', salt),
      name: 'Bob',
      role: 'engineer',
      skills: ['Node.js', 'Python'],
      seniority: 'mid',
      maxCapacity: 50,
      department: 'Backend'
    },
    {
      email: 'carol@company.com',
      password: await bcrypt.hash('password', salt),
      name: 'Carol',
      role: 'engineer',
      skills: ['React'],
      seniority: 'junior',
      maxCapacity: 100,
      department: 'Frontend'
    },
    {
      email: 'dave@company.com',
      password: await bcrypt.hash('password', salt),
      name: 'Dave',
      role: 'engineer',
      skills: ['Python'],
      seniority: 'mid',
      maxCapacity: 50,
      department: 'Data'
    }
  ];

  const savedEngineers = await User.insertMany(engineers);

  // --- Manager ---
  const manager = new User({
    email: 'manager@company.com',
    password: await bcrypt.hash('password', salt),
    name: 'Manager Mike',
    role: 'manager'
  });
  await manager.save();

  // --- Projects ---
  const projects = [
    {
      name: 'Project Apollo',
      description: 'Front-end overhaul',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      requiredSkills: ['React'],
      teamSize: 3,
      status: 'active',
      managerId: manager._id
    },
    {
      name: 'Project Zeus',
      description: 'Backend API development',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-31'),
      requiredSkills: ['Node.js', 'Python'],
      teamSize: 2,
      status: 'planning',
      managerId: manager._id
    },
    {
      name: 'Project Hera',
      description: 'Data analytics platform',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-05-15'),
      requiredSkills: ['Python'],
      teamSize: 1,
      status: 'active',
      managerId: manager._id
    }
  ];

  const savedProjects = await Project.insertMany(projects);

  // --- Assignments ---
  const assignments = [
    {
      engineerId: savedEngineers[0]._id,
      projectId: savedProjects[0]._id,
      allocationPercentage: 60,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-30'),
      role: 'Tech Lead'
    },
    {
      engineerId: savedEngineers[1]._id,
      projectId: savedProjects[1]._id,
      allocationPercentage: 50,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-31'),
      role: 'Developer'
    },
    {
      engineerId: savedEngineers[2]._id,
      projectId: savedProjects[0]._id,
      allocationPercentage: 40,
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-06-30'),
      role: 'Developer'
    },
    {
      engineerId: savedEngineers[3]._id,
      projectId: savedProjects[2]._id,
      allocationPercentage: 50,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-05-15'),
      role: 'Data Engineer'
    },
    {
      engineerId: savedEngineers[0]._id,
      projectId: savedProjects[1]._id,
      allocationPercentage: 20,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-31'),
      role: 'Consultant'
    }
  ];

  await Assignment.insertMany(assignments);

  console.log('Seeding complete!');
  mongoose.disconnect();
}

seed().catch(console.error);
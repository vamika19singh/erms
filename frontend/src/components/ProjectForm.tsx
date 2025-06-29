import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string;
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
}

const statusOptions = ['planning', 'active', 'completed'] as const;

const ProjectForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const requiredSkillsArray = data.requiredSkills.split(',').map(s => s.trim());
      await api.post('/projects', {
        ...data,
        requiredSkills: requiredSkillsArray,
        teamSize: Number(data.teamSize)
      });
      alert('Project created!');
      reset();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <h3 className="text-xl font-semibold mb-2">Create Project</h3>

      <label>Name</label>
      <input
        {...register('name', { required: 'Name is required' })}
        className="w-full border p-2 rounded"
        placeholder="Project Name"
      />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}

      <label>Description</label>
      <textarea
        {...register('description')}
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="Description"
      />
      
      <label>Start Date</label>
      <input
        type="date"
        {...register('startDate', { required: 'Start date is required' })}
        className="w-full border p-2 rounded"
      />
      {errors.startDate && <p className="text-red-600">{errors.startDate.message}</p>}

      <label>End Date</label>
      <input
        type="date"
        {...register('endDate', { required: 'End date is required' })}
        className="w-full border p-2 rounded"
      />
      {errors.endDate && <p className="text-red-600">{errors.endDate.message}</p>}

      <label>Required Skills <small>(comma separated)</small></label>
      <input
        {...register('requiredSkills')}
        className="w-full border p-2 rounded"
        placeholder="React, Node.js, Python"
      />

      <label>Team Size</label>
      <input
        type="number"
        {...register('teamSize', { required: true, min: 1 })}
        className="w-full border p-2 rounded"
        placeholder="Number of team members required"
      />
      {errors.teamSize && <p className="text-red-600">Team size must be at least 1</p>}

      <label>Status</label>
      <select {...register('status', { required: true })} className="w-full border p-2 rounded">
        {statusOptions.map(status => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;
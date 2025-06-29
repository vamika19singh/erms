import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';

interface FormData {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  role: string;
}

interface Engineer {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
}

const AssignmentForm: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.get('/engineers').then(res => setEngineers(res.data));
    api.get('/projects').then(res => setProjects(res.data));
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/assignments', {
        ...data,
        allocationPercentage: Number(data.allocationPercentage)
      });
      alert('Assignment created!');
      reset();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating assignment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <h3 className="text-xl font-semibold mb-2">Create Assignment</h3>

      <label>Engineer</label>
      <select {...register('engineerId', { required: 'Engineer is required' })} className="w-full border p-2 rounded">
        <option value="">Select Engineer</option>
        {engineers.map(e => (
          <option key={e._id} value={e._id}>{e.name}</option>
        ))}
      </select>
      {errors.engineerId && <p className="text-red-600">{errors.engineerId.message}</p>}

      <label>Project</label>
      <select {...register('projectId', { required: 'Project is required' })} className="w-full border p-2 rounded">
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      {errors.projectId && <p className="text-red-600">{errors.projectId.message}</p>}

      <label>Allocation Percentage</label>
      <input
        type="number"
        {...register('allocationPercentage', { required: true, min: 1, max: 100 })}
        className="w-full border p-2 rounded"
        placeholder="e.g. 50"
      />
      {errors.allocationPercentage && <p className="text-red-600">Must be between 1 and 100</p>}

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

      <label>Role</label>
      <input
        type="text"
        {...register('role', { required: 'Role is required' })}
        className="w-full border p-2 rounded"
        placeholder="Developer, Tech Lead, etc."
      />
      {errors.role && <p className="text-red-600">{errors.role.message}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Assignment
      </button>
    </form>
  );
};

export default AssignmentForm;
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requiredSkills: string[];
  teamSize: number;
  status: 'planning' | 'active' | 'completed';
  managerId: ObjectId;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  requiredSkills: { type: [String], default: [] },
  teamSize: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IProject>('Project', ProjectSchema);
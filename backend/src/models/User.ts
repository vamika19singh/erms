import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['engineer', 'manager'], required: true },
  skills: { type: [String], default: [] },
  seniority: { type: String, enum: ['junior', 'mid', 'senior'] },
  maxCapacity: { type: Number, default: 100 },
  department: { type: String, default: '' }
});

export default mongoose.model<IUser>('User', UserSchema);
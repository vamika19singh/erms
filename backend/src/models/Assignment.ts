import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAssignment extends Document {
  engineerId: ObjectId;
  projectId: ObjectId;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
}

const AssignmentSchema = new Schema<IAssignment>({
  engineerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  allocationPercentage: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  role: { type: String, default: 'Developer' }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
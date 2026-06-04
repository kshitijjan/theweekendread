import mongoose, { Schema, type Document } from 'mongoose';

export interface ILink extends Document {
  url: string;
  title?: string;
  description?: string;
  clerkId: string;
  status: 'pending' | 'sent';
  createdAt: Date;
  sentAt?: Date;
}

const LinkSchema: Schema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  clerkId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent'], default: 'pending', required: true },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
});

export default mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

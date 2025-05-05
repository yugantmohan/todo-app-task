import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  position: { type: Number, required: true },
},
{ timestamps: true }

);

export default mongoose.model('Todo', todoSchema);

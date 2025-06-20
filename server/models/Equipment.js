
import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  criticalLevel: {
    type: Number,
    required: true,
    default: 10
  },
  unit: {
    type: String,
    required: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Equipment', equipmentSchema);

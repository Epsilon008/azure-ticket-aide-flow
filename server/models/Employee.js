
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  assignedItems: [{
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    quantity: {
      type: Number,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Employee', employeeSchema);

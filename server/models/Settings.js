
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['appearance', 'notifications', 'system'],
    required: true
  },
  key: {
    type: String,
    required: true
  },
  value: mongoose.Schema.Types.Mixed,
  description: String
}, {
  timestamps: true
});

settingsSchema.index({ type: 1, key: 1 }, { unique: true });

export default mongoose.model('Settings', settingsSchema);

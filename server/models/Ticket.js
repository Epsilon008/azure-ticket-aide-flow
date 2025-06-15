
import mongoose from 'mongoose';

const aiSolutionSchema = new mongoose.Schema({
  solution: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  steps: [{
    type: String,
    required: true
  }],
  estimatedTime: {
    type: String,
    required: true
  }
});

const equipmentRequestSchema = new mongoose.Schema({
  equipmentType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  urgency: {
    type: String,
    enum: ['normale', 'urgente'],
    required: true
  },
  justification: {
    type: String,
    required: true
  }
});

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['panne', 'equipement'],
    required: true
  },
  status: {
    type: String,
    enum: ['nouveau', 'en-cours', 'resolu', 'ferme'],
    default: 'nouveau'
  },
  priority: {
    type: String,
    enum: ['faible', 'normale', 'haute', 'critique'],
    default: 'normale'
  },
  assignedTo: {
    type: String,
    default: null
  },
  solutions: [aiSolutionSchema],
  equipment: equipmentRequestSchema
}, {
  timestamps: true
});

// Index pour optimiser les recherches
ticketSchema.index({ type: 1, status: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ priority: 1 });

export default mongoose.model('Ticket', ticketSchema);

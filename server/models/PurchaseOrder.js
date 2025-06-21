
import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'ordered', 'received', 'cancelled'],
    default: 'pending'
  },
  totalAmount: Number,
  supplier: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: Date,
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);

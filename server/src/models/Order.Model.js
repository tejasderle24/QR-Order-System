import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  tableId: { type: String, required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  status: { type: String, enum: ['pending','preparing','served'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);

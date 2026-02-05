const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: true
  },
  transactionId: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  quantity: { type: Number, required: true },
  orderValue: { type: Number, required: true },
  status: { type: String, default: 'placed' },
  orderId: { type: String, required: true, unique: true }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)

const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  totalRevenue: { type: Number },
  totalItemsSold: { type: Number },
  orderDate: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model('Report', reportSchema)

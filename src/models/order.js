const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
})

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [orderItemSchema]
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

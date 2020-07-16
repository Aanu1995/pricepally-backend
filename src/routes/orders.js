const express = require('express')
const Order = require('../models/order')
const { auth, isAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
  const order = new Order({
    user: req.user._id,
    orderItems: req.body.orderItems
  })
  try {
    const newOrder = await order.save()
    res.status(201).send(newOrder)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user')

    res.send(orders)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

router.get('/mine', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })

    res.send(orders)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

module.exports = router

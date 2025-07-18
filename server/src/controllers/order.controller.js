import Order from '../models/Order.Model.js';

// Get all orders
export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// Get orders by table
export const getOrdersByTable = async (req, res) => {
  const { tableId } = req.params;
  const orders = await Order.find({ tableId }).sort({ createdAt: -1 });
  res.json(orders);
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    // Socket.io emit new order
    req.io.emit('newOrder', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  // Socket.io emit status update
  req.io.emit('orderStatusUpdate', updated);
  res.json(updated);
};

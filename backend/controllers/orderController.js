const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({ ...req.body, orderNumber });
    const populatedOrder = await order.populate('items.menuItem');
    
    // Socket.io emit
    const io = req.app.get('socketio');
    io.emit('newOrder', populatedOrder);
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.menuItem');
    
    const io = req.app.get('socketio');
    io.emit('orderUpdated', order);
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSalesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);
    res.json(stats[0] || { totalRevenue: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

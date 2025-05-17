const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const { connectRabbitMQ } = require('./rabbitmq');
const amqp = require('amqplib/callback_api');
const Ordeer = require('./models/Ordeer');
require('dotenv').config(); 
const authMiddleware = require('./middleware/authMiddleware');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected for Order Service'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(bodyParser.json());

let channel = null;
amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;
  connection.createChannel((err, ch) => {
    if (err) throw err;
    channel = ch;
    channel.assertQueue('order_events', { durable: false });

    channel?.consume('product_events', (msg) => {
      const event = JSON.parse(msg.content.toString());
      console.log('Received event:', event);
    }, { noAck: true });
    
  });
});


// app.use('/api/orders', orderRoutes);

// Connect to RabbitMQ
// connectRabbitMQ();

// Place an order
app.post('/orders',authMiddleware, async (req, res) => {
    const { userId, productId, quantity } = req.body;
    const order = new Ordeer({ userId, productId, quantity });
    await order.save();
  
    // Emit event: Order Placed
    const event = { type: 'Order Placed', data: { orderId: order._id, productId, quantity } };
    channel.sendToQueue('order_events', Buffer.from(JSON.stringify(event)));
    const queue="order_events";
    console.log(`Event sent to queue: ${queue}`);
  
    res.json({ 
      id : order._id,
      userId,
      productId,
      quantity,
      
      
      
      message: 'Order placed successfully' });
    console.log("Order created successfully")
  });


//get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Ordeer.find();
    res.status(200).json(orders);
    console.log("orders fetched successfullyy")
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});
app.get('/orders/:id', async (req, res) => {
  try {
    const orders = await Ordeer.findById(req.params.id);
    console.log(orders);
    if(!orders){
      console.log("not found")
    }
    res.status(200).json(orders);
   
    console.log("orders fetched successfullyyy")
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});
















const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
});

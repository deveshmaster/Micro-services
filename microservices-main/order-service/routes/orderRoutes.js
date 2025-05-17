const express = require('express');
const router = express.Router();
const {createOrder, getAllOrders} = require('../controllers/orderController'); 

// Route to create an order
router.post('/create', createOrder);

// Route to get all orders
router.get('/', getAllOrders); // Ensure this function exists in the controller

module.exports = router;

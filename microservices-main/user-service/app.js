require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const amqp = require("amqplib/callback_api");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware/authMiddleware");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for User Service"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(bodyParser.json());

// RabbitMQ connection and channel creation
let channel = null;
amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;
  connection.createChannel((err, ch) => {
    if (err) throw err;
    channel = ch;
    console.log("Connected to RabbitMQ");

    // Assert queues for sending and consuming events
    channel.assertQueue("user_events", { durable: false });
    channel.assertQueue("order_events", { durable: false });
    channel.assertQueue("product_events", { durable: false });

    // Listen for "Order Created" events from the Order Service
    channel.consume(
      "order_events",
      (msg) => {
        const event = JSON.parse(msg.content.toString());
        console.log(event);
        if (event.type === "Order Placed") {
          const { orderId, productId, quantity } = event.data;
          console.log(
            `User Service received Order Created event: Order ID: ${orderId}, Product ID: ${productId} , Quantity: ${quantity}`
          );
          // Optionally, update user-related information based on the order event
        }
      },
      { noAck: true }
    );

    channel.consume(
      "product_events",
      (msg) => {
        const event = JSON.parse(msg.content.toString());
        if (event.type === "Product Created") {
          const { productId, name } = event.data;
          console.log(
            `User Service received Product Created event: Product ID: ${productId}, Name: ${name}`
          );
          // Optionally, update user-related information based on the product event
        }
      },
      { noAck: true }
    );
  });
});

app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
    console.log("Users fetched successfully");
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});
app.get("/api/users/:id", async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    if(!users){
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(users);
    console.log("Users fetched successfully");
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// Register user route
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Emit "User Registered" event to RabbitMQ
    const event = {
      type: "User Registered",
      data: { userId: user._id, email },
    };
    channel.sendToQueue("user_events", Buffer.from(JSON.stringify(event)));
    console.log("User Registered event sent");

    res.json({ id: user._id, name, email, token, message: "Ok Success" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Profile update route
app.put("/profile", authMiddleware, async (req, res) => {
  const { userId, name, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    // Emit "User Profile Updated" event to RabbitMQ
    const event = { type: "User Profile Updated", data: { userId, name } };
    channel.sendToQueue("user_events", Buffer.from(JSON.stringify(event)));
    console.log(`Profile updated for user: ${userId}`);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.listen(3001, () => {
  console.log("User service running on port 3001");
});

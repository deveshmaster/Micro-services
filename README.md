# 🧩 Node.js Microservices Architecture with RabbitMQ & GraphQL

This project implements a microservices-based backend system using **Node.js**, where each service is responsible for a specific domain: Product, Order, User, and a GraphQL gateway for unified API access. The services communicate asynchronously via **RabbitMQ**, and use **MongoDB** for data persistence.

---

## 📦 Microservices Overview

- **Product Service**
  - Manages product catalog and inventory
  - REST API built with Express
- **Order Service**
  - Handles order creation and management
  - Subscribes to events via RabbitMQ
- **User Service**
  - Manages user registration and authentication
  - Publishes/consumes messages via RabbitMQ
- **GraphQL Gateway**
  - Exposes unified GraphQL API
  - Combines data from the above services using schema stitching and resolvers

---

## 🔧 Tech Stack

- **Node.js** + **Express**
- **MongoDB** (Mongoose ODM)
- **RabbitMQ** for message-based communication
- **GraphQL** for unified querying
- **Docker** for containerization
- **dotenv** for environment management

---

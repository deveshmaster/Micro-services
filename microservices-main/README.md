# **Project Title**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)](https://nodejs.org/)

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [GraphQL Queries and Mutations](#graphql-queries-and-mutations)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [GitHub Repository](#github-repository)

## **Introduction**
This project is a **microservices-based** application designed to manage users, products, and orders through a **GraphQL** API. The architecture comprises multiple services, each with its own responsibility, communicating via **RabbitMQ**. The backend services interact with **MongoDB** for data persistence.

## **Features**
- User Registration and Authentication
- Product Creation and Management
- Order Placement and Status Tracking
- Token-based authentication (JWT)
- Microservices architecture with inter-service communication using RabbitMQ

## **Technologies Used**
- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for building APIs
- **GraphQL**: For query-based API interactions
- **MongoDB**: NoSQL database for data storage
- **RabbitMQ**: For asynchronous messaging between services
- **Axios**: HTTP client for making API requests
- **jsonwebtoken**: For JWT-based authentication

## **Prerequisites**
Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (for local storage)
- **RabbitMQ** (for message brokering)
- **Postman** (for API testing)

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-project-repo.git
   ```

2. Install dependencies for each service:
   ```bash
   cd user-service
   node app.js
   
   cd ../product-service
   node app.js
   
   cd ../order-service
   npm install
   ```

3. Setup environment variables for each service:
   - Create a `.env` file in each service directory (e.g., `user-service`, `product-service`, etc.).
   - Add the necessary environment variables, such as `MONGO_URI`, `JWT_SECRET`, `RABBITMQ_URI`.

4. Start MongoDB and RabbitMQ locally.

## **Running the Application**

1. Start the microservices:
   ```bash
   # Start the User Service
   cd user-service
   node app.js
   
   # Start the Product Service
   cd ../product-service
   node app.js
   
   # Start the Order Service
   cd ../order-service
   npm start
   ```

2. Start the GraphQL server:
   ```bash
   cd ../graphql-service
   npm start
   ```

3. Access the GraphQL playground at:
   ```
   http://localhost:4000/graphql
   ```

## **API Endpoints**

### User Service
- `POST /users`: Register a new user.
- `GET /users`: Retrieve all users.
- `GET /users/:id`: Retrieve a user by ID.

### Product Service
- `POST /products`: Create a new product.
- `GET /products`: Retrieve all products.
- `GET /products/:id`: Retrieve a product by ID.

### Order Service
- `POST /orders`: Place a new order.
- `GET /orders`: Retrieve all orders.
- `GET /orders/:id`: Retrieve an order by ID.

## **GraphQL Queries and Mutations**

### User Registration
```graphql
mutation {
  registerUser(input: { name: "John Doe", email: "johndoe@example.com", password: "password123" }) {
    id
    name
    email
  }
}
```

### Place an Order
```graphql
mutation {
  placeOrder(input: { productId: "productID", quantity: 3, userId: "userID" }) {
    id
    quantity
    productId
    userId
  }
}
```

## **Testing**

To test the API, use **Postman** or **GraphiQL** to send HTTP requests or GraphQL queries. Ensure to pass the **JWT token** in the Authorization header for protected endpoints.

Example for **Authorization Header** in Postman:
```
Authorization: Bearer <your_jwt_token>
```

## **Contributing**

Contributions are welcome! If you want to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## **GitHub Repository**
To access the project repository, visit [GitHub - your-project-repo](https://github.com/your-username/your-project-repo).

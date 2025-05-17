const axios = require("axios");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    users: async () => {
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGZmY2FhZTcyZTE2YzI2MGE1YjJjNSIsImlhdCI6MTcyOTEwMDk3MCwiZXhwIjoxNzI5MTA0NTcwfQ.Wh9xaA7Nk60bAkJeuy5wKL6t0wRzv39a50PBy6ot5Rg"
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${token}` // Add Authorization header with token
        }
      });
      const users = response.data;
      return users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      }));
    },
    user: async (_, { id }) => {
      try {
        // Fetch user data from external service
        const response = await axios.get(
          `http://localhost:3001/api/users/${id}`
        );

        // If the request is successful, map the response to the expected structure
        // if (response.status === 200 && response.data.length > 0) {
         console.log(response);// Pick the first user from the array

          // Return the user object with id, name, and email
          return response.data;
        

        // In case the user is not found or an error occurred, return an Error object
        return {
          message: "User not found or error fetching user.",
        };
      } catch (error) {
        console.error("Error in user resolver:", error.message);

        // Return an Error object in case of failure
        return {
          message: "Failed to fetch user information",
        };
      }
    },
    products: async () => {
      const response = await axios.get("http://localhost:3002/products");
      const products = response.data;
      console.log(products);
      return products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        inventory: product.inventory,
      }));
    },

  
    product: async (_, { id }) => {
      try {
        const response = await axios.get(`http://localhost:3002/products/${id}`);
        console.log("Response is" ,response);
        if (!response.data) {
          throw new Error('Product not found');
        }
        return response.data;
      } catch (error) {
        console.error('Error fetching product:', error.message);
        throw new Error('Failed to fetch product');
      }
    },
    
    orders: async () => {
      const response = await axios.get("http://localhost:3004/orders");
      const orders = response.data;
      return orders.map((order) => ({
        id: order._id,
        status: order.status,
        quantity: order.quantity,
        userId: order.userId,
        productId: order.productId,
      }));
    },

    order: async (_, { id }) => {
      const order = await axios.get(`http://localhost:3004/orders/${id}`);
      console.log(order.data);
      return order.data;
      
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      // userInputobj = {
      //   name: input.name,
      //   email: input.email,
      //   password: input.password,
      // }
      try {
        const response = await axios.post("http://localhost:3001/users", input);

        console.log("Raw API response:", response.data);
        const user = response.data;

        // Log the user response for debugging
        console.log("User registration response:", user);

        // Check if the registration was successful based on the expected message
        if (!user || user.message !== "Ok Success") {
          console.error("User registration not allowed");
          throw new Error("Failed to register user");
        }
        const usertoken = user.token;
        console.log(usertoken);
        // Set the JWT token as a secure, HTTP-only cookie
        // res.cookie("usertoken", usertoken, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        //   maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
        // });

        // Return the necessary fields including id, name, and email
        return {
          id: user.id, // Use _id from the API response
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        console.error("Error registering user:", error.message);
        throw new Error("Failed to register user");
      }
    },

    createProduct: async (_, { input }) => {
      const { name, price, inventory } = input;
      // const token = req.cookies.usertoken;
      
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGZmY2FhZTcyZTE2YzI2MGE1YjJjNSIsImlhdCI6MTcyOTEwMDk3MCwiZXhwIjoxNzI5MTA0NTcwfQ.Wh9xaA7Nk60bAkJeuy5wKL6t0wRzv39a50PBy6ot5Rg"
      if (!token) {
        throw new Error("No authentication token found");
      }
      // Validate inventory
      if (inventory < 0) {
        throw new Error("Inventory cannot be negative");
      }
      const response = await axios.post(
        "http://localhost:3002/products",
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      console.log(response.status);
      const productApi = response.data;
      console.log(productApi)

      console.log(productApi);
      if (productApi.message !== "Product created successfully") {
        throw new Error("Product not created successfully");
      }
      const product = {
        __typename: "Product",
        id: productApi.productId,
        name: productApi.name,
        price: productApi.price,
        inventory: productApi.inventory,
      };
      return product;
    },

    placeOrder: async (_, { input }) => {
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MGZmY2FhZTcyZTE2YzI2MGE1YjJjNSIsImlhdCI6MTcyOTEwMDk3MCwiZXhwIjoxNzI5MTA0NTcwfQ.Wh9xaA7Nk60bAkJeuy5wKL6t0wRzv39a50PBy6ot5Rg"
      const requestInput  = {
        productId: input.productId,
        userId: input.userId, // Set userId from the token
        quantity: input.quantity
      };
      // const token = req.cookies.usertoken;
      if (!token) {
        throw new Error("No authentication token found");
      }
      console.log(input)
      try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.id;
        // console.log(userId);
         
        const response = await axios.post(
          "http://localhost:3004/orders",
          requestInput,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        )
        const order = response.data;
      
        return {
          id: order.id,
          quantity: order.quantity,
          productId: order.productId,
          userId: order.userId,
        };
      } catch (error) {
        throw new Error("JWT verification failed or order placement error");
      }
    },
  },
};

module.exports = resolvers;

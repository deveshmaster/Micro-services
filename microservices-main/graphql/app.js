const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const cookieParser = require('cookie-parser'); // Import cookie-parser for handling cookies
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');

const app = express();
const port = 4000;

// Create the executable schema using typeDefs and resolvers
const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Enable CORS
app.use(cors({
  credentials: true, // Enable sending cookies with CORS
  origin: 'http://localhost:3000', // Adjust this to your frontend's origin
}));

// Middleware to parse incoming JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

// GraphQL endpoint setup
app.use(
  '/graphql',
  graphqlHTTP((req, res) => ({
    schema: executableSchema,
    graphiql: true,
    context: { req, res }, // Pass req and res to the context
  }))
);

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`GraphQL API server running at http://localhost:${port}/graphql`);
});

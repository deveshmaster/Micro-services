# user-service/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the service runs on
EXPOSE 3001

# Define environment variables (can also be set in docker-compose.yml)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]

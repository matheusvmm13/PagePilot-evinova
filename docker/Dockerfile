# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TS to JS
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
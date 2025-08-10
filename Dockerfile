# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p /app/data
RUN mkdir -p /app/packages/backend/data

# Set environment for production
ENV NODE_ENV=production
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build both frontend and backend
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]

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

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment for production
ENV NODE_ENV=production
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# Build both frontend and backend
RUN npm run build

# Clean up dev dependencies and cache
RUN npm ci --only=production && npm cache clean --force

# Remove build dependencies
RUN apk del python3 make g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S slack -u 1001

# Change ownership of the app directory
RUN chown -R slack:nodejs /app
USER slack

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

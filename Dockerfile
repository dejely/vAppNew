# syntax=docker/dockerfile:1

# Build stage
FROM node:22.13.1-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY --link package.json package-lock.json ./

# Install dependencies using npm ci for a clean and deterministic install
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the application source code
COPY --link . .

# Build the TypeScript application
RUN npm run build

# Production stage
FROM node:22.13.1-slim AS final

# Set the working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the port the application will run on
EXPOSE 5500

# Set the environment to production
ENV NODE_ENV=production

# Create a non-root user and switch to it
RUN useradd -m appuser
USER appuser

# Command to run the application
CMD ["node", "dist/index.js"]
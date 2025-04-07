# syntax=docker/dockerfile:1

# Use the official Node.js image as the base image
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY --link package.json package-lock.json ./

# Install dependencies using npm ci for a clean and deterministic install
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production

# Copy the application source code
COPY --link . .

# Expose the port the application will run on
EXPOSE 5500

# Set the environment to production
ENV NODE_ENV=production

# Create a non-root user and switch to it
RUN useradd -m appuser
USER appuser

# Command to run the application
CMD ["node", "index.js"]
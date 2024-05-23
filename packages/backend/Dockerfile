# syntax=docker/dockerfile:1

# Define Node.js version
ARG NODE_VERSION=18.18.0

# Define Pnpm version
ARG PNPM_VERSION=8.9.2

# Use node image as the base image
FROM node:${NODE_VERSION}-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY pnpm-lock.yaml .

# Install pnpm
RUN npm install -g pnpm@${PNPM_VERSION}

# Install dependencies for bcrypt, Python, and C++ (use python3 if you are targeting Python 3)
RUN apk add --update \
    python3 \
    make \
    g++

# Remove APK cache
RUN rm -rf /var/cache/apk/*

# Install Node.js dependencies
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy source code
COPY src ./src
COPY README.md .
COPY tsconfig.json .

# Build the Node.js app
RUN pnpm build

# Expose port
EXPOSE 3001

# Set environment variables
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
ENV DATABASE_URL=${DATABASE_URL}
ENV BUCKET_NAME=${BUCKET_NAME}
ENV BUCKET_ID=${BUCKET_ID}
ENV BUCKET_URL=${BUCKET_URL}
ENV BUCKET_REGION=${BUCKET_REGION}
ENV BUCKET_KEY=${BUCKET_KEY}
ENV BUCKET_SECRET=${BUCKET_SECRET}
ENV BUCKET_KEY_PATH=${BUCKET_KEY_PATH}
ENV JWT_SECRET=${JWT_SECRET}
ENV STRIPE_SECRET=${STRIPE_SECRET}
ENV STRIPE_ENDPOINT_SECRET=${STRIPE_ENDPOINT_SECRET}
ENV PORT=${PORT}

# Run the app
CMD pnpm start

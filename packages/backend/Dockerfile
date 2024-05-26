# Use node image as the base image
ARG NODE_VERSION=18.18.0
FROM node:${NODE_VERSION}-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY pnpm-lock.yaml .

# Install pnpm
ARG PNPM_VERSION=8.9.2
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
EXPOSE 5000

# Run the app
CMD pnpm start

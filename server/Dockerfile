# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy root package files and workspace config
COPY package.json bun.lock ./
COPY server/package.json server/
COPY client/package.json client/

# Install dependencies using workspace
RUN bun install

# Copy the server application
COPY server/ server/

# Move to server directory
WORKDIR /app/server

# Expose the server port (src/index.ts uses 3001)
EXPOSE 3001

# Start the server
CMD ["bun", "run", "dev"]

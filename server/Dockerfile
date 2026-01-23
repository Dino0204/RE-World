# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the server port (default 3000, adjust if needed)
EXPOSE 3001

# Start the server
CMD ["bun", "run", "dev"]

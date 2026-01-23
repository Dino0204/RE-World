# Stage 1: Build the application
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy all files for workspace support and type imports
COPY . .

# Install all dependencies
RUN bun install

# Build the client
WORKDIR /app/client
RUN bun run build

# Stage 2: Production server
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy build artifacts and necessary config
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/client/.next ./client/.next
COPY --from=builder /app/client/package.json ./client/
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

# Install production dependencies
RUN bun install --production

# Move to client directory for execution
WORKDIR /app/client

EXPOSE 3000

# Next.js startup command
CMD ["bun", "run", "start"]

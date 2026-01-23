# Stage 1: Install dependencies
FROM oven/bun:latest AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:latest AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set environment variables if needed
# ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# Stage 3: Production server
FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/bun.lockb ./

RUN bun install --production --frozen-lockfile

COPY --from=builder /app/package.json ./

EXPOSE 3000

# Next.js startup command
CMD ["bun", "run", "start"]

# Stage 1: Install dependencies and build the app
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Stage 2: Create a lightweight production image
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]

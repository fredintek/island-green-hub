# Base Stage (for dependencies caching)
FROM node:22 AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Set environment variables
ENV NEXT_PUBLIC_API_URL=http://localhost:1111

# Development Stage
FROM base AS development
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Build Stage (for production)
FROM base AS builder
COPY . .
RUN npm run build

# Production Stage
FROM node:22 AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3001
CMD ["npm", "start"]
# Base Stage (for common dependencies)
FROM node:22 AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Development Stage
FROM base AS development
COPY . .
EXPOSE 1111
CMD ["npm", "run", "start:dev"]

# Build Stage (for production)
FROM base AS builder
COPY . .
RUN npm run build

# Production Stage
FROM node:22 AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/uploads ./uploads
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
EXPOSE 1111
CMD ["node", "dist/main"]
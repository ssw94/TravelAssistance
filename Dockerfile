# Stage 1: Build NestJS Application
FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/ ./
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig*.json ./

EXPOSE 5000 10000

CMD ["node", "dist/main.js"]

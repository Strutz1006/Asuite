FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S gateway -u 1001

# Change ownership
RUN chown -R gateway:nodejs /app
USER gateway

EXPOSE 3001

CMD ["npm", "start"]
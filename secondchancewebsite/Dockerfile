FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Debug: list what's in the container
RUN ls -la /app
RUN ls -la /app/build || echo "BUILD FOLDER MISSING"

EXPOSE 9000

CMD ["node", "index.js"]
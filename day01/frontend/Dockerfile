# Use Node.js 18 LTS (alpine is smaller)
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
COPY . .
ENV VITE_API_URL=http://44.198.170.149:8080
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
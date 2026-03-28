FROM node:14-alpine
workdir /app
COPY package.json ./
RUN npm install
COPY . .   

ExPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
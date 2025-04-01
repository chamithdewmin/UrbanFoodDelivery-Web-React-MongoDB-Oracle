# foodie-client Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite defaults to 5173, but let's be explicit
EXPOSE 5173

CMD ["npm", "run", "dev"]

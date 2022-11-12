FROM node:alpine

WORKDIR /app/products

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8002

RUN ["npm","start"]
FROM node:alpine

WORKDIR /app/shopping

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8003

RUN ["npm","start"]
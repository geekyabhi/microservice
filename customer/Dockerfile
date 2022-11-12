FROM node:alpine

WORKDIR /app/customer

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

RUN ["npm","start"]
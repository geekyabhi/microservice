FROM node:alpine

WORKDIR /app/customer

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]


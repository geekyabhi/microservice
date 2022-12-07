FROM node:alpine

WORKDIR /app/payments

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]
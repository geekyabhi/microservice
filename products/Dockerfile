FROM node:alpine

WORKDIR /app/products

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]
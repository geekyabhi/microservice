FROM node:alpine

WORKDIR /app/shopping

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]
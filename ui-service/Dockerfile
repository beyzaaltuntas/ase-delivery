FROM node:18.10-alpine3.15

WORKDIR /app

COPY package.json package.json

RUN npm i 

RUN npm i react-qr-reader --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


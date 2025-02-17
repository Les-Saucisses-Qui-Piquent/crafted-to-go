FROM node:20-alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "start"]


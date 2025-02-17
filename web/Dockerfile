FROM node:20-alpine

WORKDIR /app

COPY ./web/package.json .
COPY ./web/package-lock.json .

RUN npm install

EXPOSE 8081

CMD ["npm", "run", "start"]


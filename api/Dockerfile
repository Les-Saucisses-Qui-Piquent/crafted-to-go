FROM node:20-alpine

WORKDIR /api

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "start"]
FROM node:20-alpine

WORKDIR /api

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --include=dev

COPY . .

EXPOSE 3000

RUN npm run build

RUN npm run db:client

CMD ["npm", "run", "dev"]
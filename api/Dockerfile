FROM node:20-alpine

WORKDIR /api

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

# COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
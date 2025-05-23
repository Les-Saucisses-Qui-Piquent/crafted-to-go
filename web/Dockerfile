FROM node:20-alpine

WORKDIR /web

COPY ./package*.json .

# Clean install with native build
RUN npm install --force && \
    npm install -g expo-cli && \
    npm cache clean --force

# Rebuild nativewind dependencies
RUN cd node_modules/lightningcss && npm rebuild --build-from-source

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]


FROM node:latest

WORKDIR /app
COPY . .
RUN yarn install

ENTRYPOINT ["node", "/app/index.js"]

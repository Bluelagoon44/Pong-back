FROM node:24-alpine

WORKDIR /pong/back

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npx", "prisma", "generate", "&&", "node", "app.js" ]
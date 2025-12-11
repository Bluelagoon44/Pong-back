FROM node:24-alpine

WORKDIR /pong/back

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma migrate deploy

EXPOSE 4000

CMD [ "node", "app.js" ]
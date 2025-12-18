FROM node:24-alpine

WORKDIR /pong/back

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && node app.js"]
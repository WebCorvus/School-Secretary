FROM node:22.16.0 AS builder

COPY . /app
WORKDIR /app

RUN npm install

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "dev"]
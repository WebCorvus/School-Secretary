FROM cypress/browsers:latest

WORKDIR /test

COPY package.json package-lock.json ./

RUN npm install

COPY . .
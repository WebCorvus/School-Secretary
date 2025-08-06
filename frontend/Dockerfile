FROM node:22.16.0

COPY . /usr/src/app/
WORKDIR /usr/src/app/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
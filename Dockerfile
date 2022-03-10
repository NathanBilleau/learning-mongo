FROM node:16.9.0-alpine

WORKDIR /app
COPY package.json /app/
RUN cd /app
RUN yarn install

COPY . /app


CMD yarn start
# syntax=docker/dockerfile:1
FROM node:12.22.9
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD npm run test

FROM node:8.9.4-alpine

RUN npm install -g serve

COPY . /app/

WORKDIR /app
RUN npm install
RUN npm run build

CMD serve -s /app/build

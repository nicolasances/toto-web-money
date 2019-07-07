FROM node:8.9.4-alpine

RUN npm install -g serve

COPY . /app/

RUN ls /app
RUN npm run build --prefix /app

CMD serve -s /app/build

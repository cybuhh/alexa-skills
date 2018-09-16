FROM node:10-alpine

EXPOSE 3000
WORKDIR /app
ADD . .
RUN npm i --production

CMD ["node", "index"]

FROM node:14.15-alpine

WORKDIR /app

COPY package*.json /app/

RUN apk add python2
RUN apk add build-base

RUN npm ci

# Bundle app source
COPY . .

# start app
CMD ["node", "src/server.js"]

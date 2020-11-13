FROM node:14.15-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm ci
# Bundle app source
COPY . .

RUN sed -i 's/http\:\/\/localhost/http\:\/\/backend/g' package.json

#EXPOSE 3000

# start app
CMD ["npm", "start"]

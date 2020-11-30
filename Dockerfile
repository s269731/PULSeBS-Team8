FROM node:latest
COPY . /opt/PULSeBS-Team8
WORKDIR /opt/PULSeBS-Team8
RUN cd client; npm install; cd ..
RUN cd server; npm install; cd ..
CMD CI=true npm start --prefix ./client & npm start --prefix ./server
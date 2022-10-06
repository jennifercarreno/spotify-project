FROM node:14

WORKDIR /spotify-clone-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start
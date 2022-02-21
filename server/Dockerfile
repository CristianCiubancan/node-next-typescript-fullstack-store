FROM node:16 
# changed to code below to work on m1 mac
# FROM node:16-bullseye

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

# EXPOSE 9999
# CMD [ "node", "dist/index.js" ]
USER node 
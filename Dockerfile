FROM node:14-alpine as BUILD_IMAGE

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY package*.json tsconfig*.json ./
RUN npm install
COPY @types ./@types
COPY src ./src
RUN npm run compile && npm prune --production

FROM node:14-alpine

ENV TZ=Europe/Berlin
WORKDIR /usr/src/app
COPY --from=BUILD_IMAGE /usr/src/app/build ./build
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
CMD ["npm", "run", "start:prod" ]

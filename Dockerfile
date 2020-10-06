FROM node:14

ENV TZ=Europe/Berlin
WORKDIR /usr/src/app
COPY package*.json tsconfig*.json ./
RUN npm install
COPY @types ./@types
COPY src ./src
RUN npm run compile && npm prune --production
CMD ["npm", "run", "start:prod" ]

# graphql-gateway/Dockerfile

FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]

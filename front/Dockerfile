FROM node:24.15.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 443

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

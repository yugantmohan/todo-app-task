FROM node:18

RUN apt-get update && apt-get install -y python3 g++ make

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]

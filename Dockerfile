FROM node:16

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /usr/src/app/init-script.sh

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "/usr/src/app/init-script.sh"]
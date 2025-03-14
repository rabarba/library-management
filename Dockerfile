# Node.js için base image
FROM node:16

# Çalışma dizini oluştur
WORKDIR /usr/src/app

# package.json ve package-lock.json'ı container'a kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama dosyalarını container'a kopyala
COPY . .

# TypeScript'i derlemek için komut (tsc komutunu çalıştırır)
RUN npm run build

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000

# Uygulama çalıştırma komutu
CMD ["npm", "run", "start"]

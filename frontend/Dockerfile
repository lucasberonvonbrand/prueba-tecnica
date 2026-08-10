FROM node:22-alpine

WORKDIR /app

# Copiamos package.json y lock
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Compilamos la aplicación para producción (SSR)
RUN npm run build

EXPOSE 3000

# Iniciamos el servidor de producción (vinxi start)
CMD ["npm", "run", "start"]

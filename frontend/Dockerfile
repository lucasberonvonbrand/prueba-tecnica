FROM node:22-alpine

WORKDIR /app

# Copiamos package.json y lock
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Compilamos la aplicación para producción (esto soluciona el problema de interfaz invisible)
RUN npm run build

EXPOSE 80

# Arrancamos el servidor de producción (consume poquísima RAM, excelente para Render)
CMD ["npm", "run", "start"]

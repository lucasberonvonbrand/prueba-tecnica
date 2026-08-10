FROM node:22-alpine

WORKDIR /app

# Copiamos package.json y lock
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Compilamos la aplicación para producción usando vinxi (el motor de TanStack Start)
RUN npx vinxi build

EXPOSE 80

# Arrancamos el servidor de producción con vinxi
CMD ["npx", "vinxi", "start"]

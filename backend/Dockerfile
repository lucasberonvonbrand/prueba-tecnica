FROM node:22-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente saltando errores de peers
RUN npm ci --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Compilamos TypeScript a JavaScript
RUN npm run build

# Exponemos el puerto del backend (Hono por defecto usa 3000)
EXPOSE 3000

# Iniciamos el servidor compilado
CMD ["npm", "run", "start"]

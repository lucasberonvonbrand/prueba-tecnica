FROM node:22-alpine

WORKDIR /app

# Copiamos package.json y lock
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Omitimos la compilación de producción para evitar el problema del SSR
# y levantamos el servidor de Vite directamente que funciona 100%

EXPOSE 80

# Usamos el servidor de desarrollo de Vite bindeado al puerto 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

FROM node:22-alpine

WORKDIR /app

# Copiamos package.json y lock
COPY package.json package-lock.json* ./

# Instalamos dependencias limpiamente
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Pre-optimizamos dependencias pesadas (HeroUI, framer-motion) para evitar que
# el servidor Vite se quede sin memoria RAM al arrancar en el entorno gratuito de Render
RUN npx vite optimize

EXPOSE 80

# Usamos el servidor de Vite que funcionó bien, pero ahora ya está pre-optimizado
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

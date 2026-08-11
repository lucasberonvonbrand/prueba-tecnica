# Construcción (Builder)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Producción (Servidor Nginx)
FROM nginx:alpine
# Copiamos el build del frontend a la carpeta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copiamos una configuración para SPA (redirecciona todo a index.html)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

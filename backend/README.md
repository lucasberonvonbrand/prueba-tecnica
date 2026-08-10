# Backend: Gestor de Artículos

Aplicación construida usando arquitectura multicapa (similar a Spring Boot) utilizando las siguientes tecnologías:

- **Hono**: Framework ligero y rápido para la API.
- **MongoDB (Native Driver)**: Para las operaciones de base de datos y persistencia (con volumen en Docker).
- **Better Auth**: Gestión de autenticación por Email/Password usando el plugin JWT (sin sesiones persistidas).
- **Zod**: Validación de datos tanto en requests (DTOs) como para tipado interno.
- **Docker & Docker Compose**: Contenedorización de la base de datos.

## Estructura de Carpetas

Basada en los principios Clean Architecture / MVC:
- `/src/config`: Inicialización de conexiones.
- `/src/controller`: Definición de endpoints Hono.
- `/src/service`: Lógica de negocio e interacción con repositorios.
- `/src/repository`: Acceso puro a MongoDB.
- `/src/model` y `/src/dto`: Modelos de negocio y validaciones para entrada/salida.
- `/src/mapper`: Conversión entre Entidades DB y DTOs (Data Transfer Objects).

## Cómo ejecutar

1. Renombra `.env.example` a `.env` (o crea uno nuevo) y completa las variables.
2. Levanta la base de datos usando Docker:
   ```bash
   docker compose up -d
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

## Seed de Datos

Si quieres poblar la base de datos, ejecuta (con la app corriendo en otra pestaña):
```bash
npx tsx seed.ts
```

## Uso de IA 🤖

En el desarrollo de este backend me asistí del modelo **Gemini 3.1 Pro (High)**. 
- **Generación de estructura (Scaffolding)**: Para montar rápidamente las capas (Repository, Service, Controller).
- **Configuración de Better Auth**: Para la correcta integración con el adaptador de MongoDB nativo y el plugin de JWT (stateless).
- **Mapeos de Error**: Para construir un manejador de excepciones global inspirado en `@ControllerAdvice` de Java Spring.

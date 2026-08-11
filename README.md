# 📝 Gestor de Artículos - Fullstack

Este proyecto es una aplicación web fullstack desarrollada como prueba técnica para la posición de Fullstack Developer Trainee / Junior. Permite a los usuarios registrarse, iniciar sesión, y gestionar (crear, editar, eliminar y leer) sus propios artículos, además de contar con una página pública para explorar los artículos de todos los autores.

🌐 **Demo en Producción**: [https://prueba-tecnica-lucas-beron.onrender.com](https://prueba-tecnica-lucas-beron.onrender.com)

### ☁️ Infraestructura de Despliegue en la Nube

- 🖥️ **Frontend**: Desplegado como **Static Site** en Render.
- ⚙️ **Backend**: Desplegado como **Web Service** en Render.
- 🍃 **Base de Datos**: Alojada en **MongoDB Atlas** (Cluster Cloud).

> ⚠️ **Nota sobre la instancia en Producción (Tier Gratuito de Render):**
> Al estar alojado en el plan gratuito de Render, el backend entra en modo suspensión (_spin-down_) si no recibe tráfico durante 15 minutos. Por este motivo, la primera carga o petición inicial puede demorar entre **30 y 50 segundos** mientras el servidor de Render arranca la instancia. Una vez iniciada, el resto de la navegación funcionará de forma fluida.

---

## 🧱 Arquitectura y Tecnologías

El proyecto sigue una arquitectura moderna, separando el backend y el frontend, pero manteniéndolos en un monorepo para facilitar su desarrollo y despliegue.

**Frontend:**

- ✅ **Framework**: React + TypeScript + Vite
- ✅ **Routing & Data Fetching**: TanStack Router & TanStack Query
- ✅ **Formularios**: TanStack Form + Zod
- ✅ **UI Componentes**: HeroUI (NextUI) + Tailwind CSS

**Backend:**

- ✅ **Framework**: Hono (Node.js)
- ✅ **Base de Datos**: MongoDB (Driver nativo)
- ✅ **Autenticación**: Better Auth (JWT + HTTP-Only Cookies)
- ✅ **Validación**: Zod

---

## 💡 Decisiones de Diseño y Justificaciones Técnicas

#### ¿Por qué una Arquitectura Monolítica en Capas para el Backend?

En el backend se optó por una **Arquitectura en Capas (N-Tier)** clásica (`controller`, `service`, `repository`, `dto`, `model`, `mapper`, `exception`).

- **Separación de Responsabilidades**: Los controladores solo atienden peticiones HTTP, la lógica de negocio vive aislada en los servicios, y las consultas a la base de datos están estrictamente encapsuladas en los repositorios.
- **Mantenibilidad y Escalabilidad**: Permite auditar o reemplazar la persistencia (por ejemplo, migrar de MongoDB a PostgreSQL) tocando únicamente los repositorios, sin afectar la lógica de negocio ni las rutas de la API.

#### ¿Por qué Feature-Sliced Design en el Frontend?

Para evitar el clásico problema de tener cientos de componentes mezclados en una sola carpeta, se estructuró el frontend utilizando conceptos de **Feature-Sliced Design**.

- La lógica se divide por dominios de negocio (`features/articles`, `features/auth`, `features/public`).
- Esto hace que el código sea predecible, altamente escalable y muy fácil de mantener.

#### ¿Por qué JWT y Cookies HTTP-Only con Better Auth?

En lugar de guardar las sesiones en la base de datos (stateful), se configuró Better Auth para utilizar el plugin de **JWT**.

- **Stateless & Rápido**: El backend valida los permisos desencriptando el token sin necesidad de hacer consultas extra a MongoDB.
- **Seguridad**: El JWT viaja dentro de una **Cookie HTTP-Only**, lo que hace imposible que el token sea robado mediante ataques XSS desde el navegador.

#### CI/CD y Despliegue Automatizado

- Se configuraron workflows de **GitHub Actions** (`.github/workflows/`) tanto para el frontend como para el backend.
- Esto permite integración continua (CI) y despliegue automático (CD) ante cada push a la rama `master` en Render.

---

## 🤖 Uso de Inteligencia Artificial (Antigravity)

Para la realización integral de esta prueba técnica se utilizó **Antigravity**, el agente avanzado de desarrollo en pair-programming desarrollado por el equipo de Google.

- **Desarrollo End-to-End**: Se utilizó Antigravity como compañero de pair-programming durante todo el ciclo de vida del proyecto: desde el maquetado inicial, la definición de la arquitectura de software (Capas en Backend y Feature-Sliced en Frontend), hasta la implementación de lógica de negocio y resolución de bugs.
- **Validación Typesafe**: Ayudó a sincronizar y garantizar que los esquemas de validación de Zod en el backend coincidieran exactamente con los adaptadores de formularios en el cliente.
- **Refactorización y Limpieza**: Facilitó la fragmentación de componentes monolíticos grandes en submódulos pequeños, limpios y testeables.
- **Generación de Datos de Prueba (Seed)**: Creación de un script idempotente (`seed.js`) integrado en Docker para popular automáticamente la base de datos con usuarios y publicaciones realistas.

---

## ✨ Funcionalidades Principales

1. **Autenticación Segura**: Registro y login. Rutas protegidas (el Dashboard redirige al login si no hay sesión activa y viceversa con Guest Guard).
2. **Gestión de Artículos (CRUD)**: Creación de artículos con título, contenido e imagen opcional. Solo el creador puede editar o borrar sus propios artículos con modal de confirmación.
3. **Página Pública y Buscador**: Visualización del top de autores y buscador de artículos en tiempo real (busca simultáneamente por título, contenido y nombre del autor desde el servidor).
4. **Protección Extrema (Zod)**: Tanto la API como los formularios del cliente rechazan datos inválidos antes de que toquen la base de datos.
5. **UX Cuidada**: Uso de _Skeletons_ para estados de carga, _Empty States_ amigables cuando no hay datos, y navegación fluida entre páginas con scroll restoration.

---

## 🔗 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint                  | Descripción                                    | Acceso      |
| :----- | :------------------------ | :--------------------------------------------- | :---------- |
| `POST` | `/api/auth/sign-up/email` | Registrar un nuevo usuario                     | Público     |
| `POST` | `/api/auth/sign-in/email` | Iniciar sesión con email y contraseña          | Público     |
| `POST` | `/api/auth/sign-out`      | Cerrar la sesión activa                        | Autenticado |
| `GET`  | `/api/auth/get-session`   | Obtener la información del usuario autenticado | Autenticado |

### 📰 Feed Público (`/api/public`)

| Método | Endpoint                   | Descripción                                                                 | Acceso  |
| :----- | :------------------------- | :-------------------------------------------------------------------------- | :------ |
| `GET`  | `/api/public/articles`     | Listar publicaciones con paginación (`page`, `limit`) y buscador (`search`) | Público |
| `GET`  | `/api/public/articles/:id` | Obtener el detalle de una publicación específica                            | Público |
| `GET`  | `/api/public/authors`      | Listar autores principales y su cantidad de publicaciones                   | Público |

### ✍️ Gestión Privada de Artículos (`/api/articles`)

| Método   | Endpoint            | Descripción                                             | Acceso  |
| :------- | :------------------ | :------------------------------------------------------ | :------ |
| `GET`    | `/api/articles`     | Listar publicaciones creadas por el usuario autenticado | Privado |
| `POST`   | `/api/articles`     | Crear una nueva publicación                             | Privado |
| `PUT`    | `/api/articles/:id` | Editar una publicación propia existente                 | Privado |
| `DELETE` | `/api/articles/:id` | Eliminar una publicación propia                         | Privado |

---

## ⚙️ Cómo Ejecutar el Proyecto

El proyecto está dockerizado para que pueda ejecutarse con un solo comando sin tener que instalar dependencias pesadas manualmente.

### Requisitos Previos

- Docker y Docker Compose instalados.

### Paso a Paso

1️⃣ **Clonar el repositorio y entrar a la carpeta**:

```bash
git clone <URL-DEL-REPOSITORIO>
cd prueba-tecnica
```

2️⃣ **Configurar las variables de entorno**:
En la raíz del proyecto encontrarás un archivo `.env.example`. Crea una copia exacta de este archivo y renómbralo a `.env`:

```bash
cp .env.example .env
```

3️⃣ **Levantar la aplicación**:
Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker compose up -d --build
```

4️⃣ **¡Listo!**

- La **Aplicación Web** estará disponible en: [http://localhost:4000](http://localhost:4000)
- La base de datos (MongoDB) estará inicializada y un contenedor especial se encargará de **poblarla con datos de prueba** automáticamente para que no tengas que crear cuentas manualmente.

> **Credenciales de prueba generadas por el Seed:**
>
> - **Email**: `ana@ejemplo.com` / `carlos@ejemplo.com`
> - **Contraseña**: `password123`

---

## 📁 Estructura del Repositorio (Resumen)

```
prueba-tecnica/
├── .github/
│   └── workflows/       # Pipelines de CI/CD (Frontend y Backend)
├── backend/
│   └── src/
│       ├── config/       # Configuración de BD y Auth
│       ├── controller/   # Manejadores de rutas HTTP
│       ├── dto/          # Validadores Zod (Esquemas)
│       ├── exception/    # Manejador global de errores HTTP
│       ├── mapper/       # Mapeadores Entidad -> DTO
│       ├── middleware/   # Protección de rutas privadas
│       ├── model/        # Tipos e interfaces de MongoDB
│       ├── repository/   # Consultas a MongoDB (nativo)
│       └── service/      # Lógica de negocio (Verificación de propiedad)
├── frontend/
│   └── src/
│       ├── core/         # Providers globales y config de Axios
│       ├── features/     # Feature-Sliced Design (articles, auth, public)
│       └── routes/       # Rutas automáticas de TanStack Router
├── docker-compose.yml    # Orquestación de servicios
├── seed.js               # Script de datos iniciales
└── .env.example          # Variables de entorno
```

---

Proyecto desarrollado por Lucas Ruben Beron Von Brand 🚀

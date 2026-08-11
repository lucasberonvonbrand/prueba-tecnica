# 📝 Gestor de Artículos - Fullstack

Este proyecto es una aplicación web fullstack desarrollada como prueba técnica para la posición de Fullstack Developer Trainee / Junior. Permite a los usuarios registrarse, iniciar sesión, y gestionar (crear, editar, eliminar y leer) sus propios artículos, además de contar con una página pública para explorar los artículos de todos los autores.

🌐 **Demo en Producción**: [Enlace a la aplicación desplegada](https://tu-app.onrender.com) *(Reemplazar con tu URL final)*

---

## 🧱 Arquitectura y Tecnologías

El proyecto sigue una arquitectura moderna, separando el backend y el frontend, pero manteniéndolos en un monorepo para facilitar su desarrollo y despliegue.

**Frontend:**
- ✅ **Framework**: React + TypeScript + Vite
- ✅ **Routing & Data Fetching**: TanStack Router & TanStack Query
- ✅ **Formularios**: TanStack Form + Zod Adapter
- ✅ **UI Componentes**: HeroUI (NextUI) + Tailwind CSS

**Backend:**
- ✅ **Framework**: Hono (Node.js)
- ✅ **Base de Datos**: MongoDB (Driver nativo)
- ✅ **Autenticación**: Better Auth (JWT + HTTP-Only Cookies)
- ✅ **Validación**: Zod + `@hono/zod-validator`

---

## 💡 Decisiones de Diseño y Justificaciones Técnicas

#### ¿Por qué una Arquitectura Monolítica en Capas para el Backend?
En el backend se optó por una **Arquitectura en Capas (N-Tier)** clásica (`controller`, `service`, `repository`, `dto`, `model`, `mapper`, `exception`).
- **Separación de Responsabilidades**: Los controladores solo atienden peticiones HTTP, la lógica de negocio vive aislada en los servicios, y las consultas a la base de datos están estrictamente encapsuladas en los repositorios.
- **Mantenibilidad y Escalabilidad**: Permite auditar o reemplazar la persistencia (por ejemplo, migrar de MongoDB a PostgreSQL) tocando únicamente los repositorios, sin afectar la lógica de negocio ni las rutas de la API.

#### ¿Por qué Feature-Sliced Design en el Frontend?
Para evitar el clásico problema de tener cientos de componentes mezclados en una sola carpeta, se estructuró el frontend utilizando conceptos de **Feature-Sliced Design**. 
- La lógica se divide por dominios de negocio (ej: `features/articles`, `features/auth`).
- Esto hace que el código sea predecible, altamente escalable y muy fácil de mantener.

#### ¿Por qué JWT y Cookies HTTP-Only con Better Auth?
En lugar de guardar las sesiones en la base de datos (stateful), se configuró Better Auth para utilizar el plugin de **JWT**.
- **Stateless & Rápido**: El backend valida los permisos desencriptando el token sin necesidad de hacer consultas extra a MongoDB.
- **Seguridad**: El JWT viaja dentro de una **Cookie HTTP-Only**, lo que hace imposible que el token sea robado mediante ataques XSS desde el navegador.

#### ¿Por qué TanStack Query con Invalidación de Caché?
Se utilizó TanStack Query para sincronizar el estado del servidor con React. 
- En lugar de manejar estados locales (`useState`) largos y propensos a errores, se realizan mutaciones (Crear/Editar/Borrar) que, en su evento `onSuccess`, desencadenan un `queryClient.invalidateQueries()`. 
- Esto asegura que la interfaz siempre refleje la verdad de la base de datos de manera instantánea y elegante.

#### CI/CD y Despliegue Automatizado
- Se configuraron workflows de **GitHub Actions** (`.github/workflows/`) tanto para el frontend como para el backend.
- Esto permite integración continua (CI) y despliegue automático (CD) ante cada push a la rama `master`, garantizando que la aplicación esté siempre lista para producción.

---

## 🤖 Uso de Inteligencia Artificial (Antigravity)

Para la realización integral de esta prueba técnica se utilizó **Antigravity**, el agente avanzado de desarrollo en pair-programming desarrollado por el equipo de Google DeepMind.

- **Desarrollo End-to-End**: Se utilizó Antigravity como compañero de pair-programming durante todo el ciclo de vida del proyecto: desde el maquetado inicial, la definición de la arquitectura de software (Capas en Backend y Feature-Sliced en Frontend), hasta la implementación de lógica de negocio y resolución de bugs.
- **Validación Typesafe**: Ayudó a sincronizar y garantizar que los esquemas de validación de Zod en el backend coincidieran exactamente con los adaptadores de formularios en el cliente.
- **Refactorización y Limpieza**: Facilitó la fragmentación de componentes monolíticos grandes en submódulos pequeños, limpios y testeables.
- **Generación de Datos de Prueba (Seed)**: Creación de un script idempotente (`seed.js`) integrado en Docker para popular automáticamente la base de datos con usuarios y publicaciones realistas.

---

## ✨ Funcionalidades Principales

1. **Autenticación Segura**: Registro y login. Rutas protegidas (el Dashboard redirige al login si no hay sesión activa).
2. **Gestión de Artículos (CRUD)**: Creación de artículos con título, contenido e imagen opcional. Solo el creador puede editar o borrar sus propios artículos.
3. **Página Pública y Buscador**: Visualización del top de autores y buscador de artículos en tiempo real (busca simultáneamente por título, contenido y nombre del autor desde el servidor).
4. **Protección Extrema (Zod)**: Tanto la API como los formularios del cliente rechazan datos inválidos antes de que toquen la base de datos.
5. **UX Cuidada**: Uso de *Skeletons* para estados de carga, *Empty States* amigables cuando no hay datos, e interceptores de error para evitar pantallas blancas.

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
*(No es necesario cambiar los valores por defecto, están preparados para funcionar localmente con Docker).*

3️⃣ **Levantar la aplicación**:
Ejecuta el siguiente comando en la raíz del proyecto:
```bash
docker compose up -d --build
```

4️⃣ **¡Listo!**
- El **Frontend** estará disponible en: `http://localhost:5173`
- El **Backend** estará corriendo en: `http://localhost:3000`
- La base de datos (MongoDB) estará inicializada y un contenedor especial se encargará de **poblarla con datos de prueba** automáticamente para que no tengas que crear cuentas manualmente.

> **Credenciales de prueba generadas por el Seed:**
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

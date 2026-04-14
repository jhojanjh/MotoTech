# 🏍 MotoTech — Sistema de Gestión para Taller de Motos

App web completa para administrar un taller de motos. Registro de trabajadores, clientes, inventario, servicios, finanzas y reportes de comisiones.

**Demo:** https://moto-tech-alpha.vercel.app

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JavaScript vanilla |
| Backend | Node.js + Express |
| Base de datos | MongoDB Atlas |
| Autenticación | JWT + bcrypt |
| Hosting frontend | Vercel |
| Hosting backend | Vercel (serverless) |

---

## Estructura del proyecto

```
mototech/
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── index.js        (Trabajador, Cliente, Producto, Servicio, Pago, Usuario)
│   ├── routes/
│   │   ├── auth.js          ← login, setup, cambio de contraseña
│   │   ├── trabajadores.js
│   │   ├── clientes.js
│   │   ├── productos.js
│   │   ├── servicios.js
│   │   ├── pagos.js
│   │   └── reportes.js
│   ├── middleware/
│   │   └── auth.js          ← verificación JWT
│   ├── api/
│   │   └── index.js         ← handler serverless para Vercel
│   ├── vercel.json
│   └── package.json
└── frontend/
    ├── index.html           ← app completa (SPA)
    └── vercel.json
```

---

## Módulos

- **Dashboard** — métricas generales, gráficos, stock bajo, ranking de trabajadores
- **Trabajadores** — CRUD, tarjetas con estadísticas y comisiones
- **Inventario** — repuestos, precios, stock, alertas de mínimo
- **Servicios** — registro de trabajos, repuestos usados, descuento automático de stock
- **Finanzas** — ingresos, costos y ganancias por período y trabajador
- **Clientes** — historial de servicios y gasto total
- **Reportes** — liquidación de comisiones con registro de pagos
- **Login** — autenticación con JWT, sesión de 24 horas

---

## Despliegue desde cero

### 1. MongoDB Atlas
1. Crea cuenta en https://cloud.mongodb.com
2. Crea un cluster gratuito (M0)
3. En **Database Access** → crea usuario con contraseña
4. En **Network Access** → agrega `0.0.0.0/0`
5. Copia la URI: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/`

### 2. Backend en Vercel
1. Ve a https://vercel.com → **Add New Project**
2. Importa el repo `jhojanjh/MotoTech`
3. **Root Directory:** `backend`
4. Agrega variables de entorno:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | tu URI de MongoDB Atlas |
| `ALLOWED_ORIGINS` | `https://tu-frontend.vercel.app` |
| `JWT_SECRET` | una cadena aleatoria larga |

5. Deploy. La URL del backend sera: `https://tu-backend.vercel.app`

### 3. Frontend en Vercel
1. Nuevo proyecto → mismo repo
2. **Root Directory:** `frontend`
3. En `frontend/index.html` actualiza la URL del backend:
```js
: 'https://tu-backend.vercel.app/api';
```
4. Deploy. La URL del frontend sera: `https://tu-frontend.vercel.app`

### 4. Primer acceso
1. Abre la app → pantalla de login
2. Click en **"Crear administrador"**
3. Crea tu usuario y contraseña (min 6 caracteres)
4. Inicia sesion

> Si olvidaste la contraseña: ve a MongoDB Atlas → coleccion `usuarios` → elimina el documento → vuelve al paso 2.

---

## Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env   # edita con tu MONGODB_URI y JWT_SECRET
npm install
npm run dev            # corre en http://localhost:3001

# Frontend
# Abre frontend/index.html con Live Server (VS Code)
```

---

## API Reference

Todas las rutas excepto `/api/auth/*` requieren el header:
```
Authorization: Bearer <token>
```

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/setup` | Crear primer administrador (solo una vez) |
| GET | `/api/trabajadores` | Listar trabajadores |
| POST | `/api/trabajadores` | Crear trabajador |
| PUT | `/api/trabajadores/:id` | Editar trabajador |
| DELETE | `/api/trabajadores/:id` | Eliminar trabajador |
| GET | `/api/clientes` | Listar clientes |
| POST | `/api/clientes` | Crear cliente |
| GET | `/api/productos` | Listar inventario |
| POST | `/api/productos/:id/stock` | Ajustar stock |
| GET | `/api/servicios` | Listar servicios (filtros: `desde`, `hasta`, `trabajadorId`) |
| POST | `/api/servicios` | Registrar servicio (descuenta stock automáticamente) |
| GET | `/api/pagos` | Listar pagos |
| POST | `/api/pagos` | Registrar pago de comisión |
| GET | `/api/reportes` | Reporte completo (filtros: `desde`, `hasta`, `trabajadorId`) |
| GET | `/health` | Health check |

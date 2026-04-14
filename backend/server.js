require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir peticiones sin origin (Postman, curl) en desarrollo
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido → ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── AUTENTICACION ─────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));

const auth = require('./middleware/auth');

// ── RUTAS PROTEGIDAS ──────────────────────────────────────────────────────────
app.use('/api/trabajadores', auth, require('./routes/trabajadores'));
app.use('/api/clientes',     auth, require('./routes/clientes'));
app.use('/api/productos',    auth, require('./routes/productos'));
app.use('/api/servicios',    auth, require('./routes/servicios'));
app.use('/api/pagos',        auth, require('./routes/pagos'));
app.use('/api/reportes',     auth, require('./routes/reportes'));

// Health check — Render lo usa para detectar que el servicio está vivo
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// 404 genérico
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Error handler global
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

// ── MONGODB + ARRANQUE ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

// Exportar app para Vercel serverless
module.exports = app;

// Solo arrancar servidor si se ejecuta directamente (no en serverless)
if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB Atlas conectado');
      app.listen(PORT, () => console.log(`🚀 API corriendo en http://localhost:${PORT}`));
    })
    .catch(err => {
      console.error('❌ Error conectando MongoDB:', err.message);
      process.exit(1);
    });
}

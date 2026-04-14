require('dotenv').config();
const mongoose = require('mongoose');

// Cache de conexion MongoDB para reutilizar entre invocaciones serverless
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const app = require('../server');

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { Usuario } = require('../models');

const SECRET = process.env.JWT_SECRET || 'mototech_secret_key';

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

    const user = await Usuario.findOne({ username: username.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  } catch (e) { next(e); }
});

// POST /api/auth/setup — solo funciona si no existe ningun usuario
router.post('/setup', async (req, res, next) => {
  try {
    const count = await Usuario.countDocuments();
    if (count > 0)
      return res.status(403).json({ error: 'Ya existe un usuario administrador' });

    const { username, password } = req.body;
    if (!username || !password || password.length < 6)
      return res.status(400).json({ error: 'Usuario y contraseña (min 6 caracteres) requeridos' });

    const hash = await bcrypt.hash(password, 10);
    await Usuario.create({ username: username.toLowerCase().trim(), password: hash });
    res.status(201).json({ ok: true, message: 'Administrador creado correctamente' });
  } catch (e) { next(e); }
});

// POST /api/auth/change-password — cambiar contraseña
router.post('/change-password', async (req, res, next) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });

    const user = await Usuario.findOne({ username: username.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;

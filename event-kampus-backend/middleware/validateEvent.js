module.exports = (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      typeof body.name !== 'string' || !body.name.trim() ||
      typeof body.loc !== 'string' || !body.loc.trim()) {
    return res.status(400).json({ message: 'name dan loc wajib berupa teks yang tidak kosong.' });
  }
  req.eventData = { name: body.name.trim(), loc: body.loc.trim() };
  next();
};

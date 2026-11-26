// Token demo untuk latihan, dikirim melalui Authorization: Bearer demo-token.
module.exports = (req, res, next) => {
  if (req.get('Authorization') !== 'Bearer demo-token') {
    return res.status(401).json({ message: 'Token demo tidak ada atau tidak valid.' });
  }
  next();
};

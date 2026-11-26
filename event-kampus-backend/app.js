const express = require('express');
const eventsRouter = require('./routes/events');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/events', eventsRouter);
app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan.' }));
app.use(errorHandler);

module.exports = app;

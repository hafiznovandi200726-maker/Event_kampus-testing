const service = require('../services/eventsService');

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function positiveInteger(value, fallback, label) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw badRequest(`${label} harus berupa bilangan bulat positif.`);
  }
  return Number(value);
}

function textFilter(value, label) {
  if (value === undefined) return '';
  if (typeof value !== 'string') throw badRequest(`${label} harus berupa teks.`);
  return value.trim();
}

exports.list = (req, res) => {
  const page = positiveInteger(req.query.page, 1, 'page');
  const limit = positiveInteger(req.query.limit, 10, 'limit');
  const q = textFilter(req.query.q, 'q');
  const loc = textFilter(req.query.loc, 'loc');
  res.json(service.list({ page, limit, q, loc }));
};

exports.detail = (req, res) => {
  res.json(service.detail(positiveInteger(req.params.id, undefined, 'id')));
};

exports.create = (req, res) => {
  const event = service.create(req.eventData);
  res.status(201).location(`/api/events/${event.id}`).json(event);
};

exports.update = (req, res) => {
  res.json(service.update(positiveInteger(req.params.id, undefined, 'id'), req.eventData));
};

exports.remove = (req, res) => {
  service.remove(positiveInteger(req.params.id, undefined, 'id'));
  res.status(204).end();
};

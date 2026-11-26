// Penyimpanan in-memory: data kembali ke nilai awal saat server restart.
const events = [
  { id: 1, name: 'Seminar AI', loc: 'Medan' },
  { id: 2, name: 'Workshop React', loc: 'Medan' }
];
let nextId = 3;

function indexOfEvent(id) {
  const index = events.findIndex(event => event.id === id);
  if (index === -1) {
    throw Object.assign(new Error('Event tidak ditemukan.'), { status: 404 });
  }
  return index;
}

exports.list = ({ page, limit, q, loc }) => {
  const filtered = events.filter(event =>
    event.name.toLowerCase().includes(q.toLowerCase()) &&
    (!loc || event.loc.toLowerCase() === loc.toLowerCase())
  );
  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) }
  };
};

exports.detail = id => ({ ...events[indexOfEvent(id)] });

exports.create = data => {
  const event = { id: nextId++, name: data.name, loc: data.loc };
  events.push(event);
  return { ...event };
};

exports.update = (id, data) => {
  const index = indexOfEvent(id);
  events[index] = { id, name: data.name, loc: data.loc };
  return { ...events[index] };
};

exports.remove = id => {
  events.splice(indexOfEvent(id), 1);
};

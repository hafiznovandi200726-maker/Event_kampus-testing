// src/App.jsx - Event Kampus dengan Fitur Edit & Tabel
import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router'

const contoh = [
  { id: '1', title: 'Seminar AI Kampus', date: '2026-11-12', location: 'Fasilkom TI' },
  { id: '2', title: 'Workshop React', date: '2026-11-20', location: 'Lab Komputer' },
  { id: '3', title: 'Hackathon Web Dev', date: '2026-12-01', location: 'Auditorium' },
  { id: '4', title: 'Lomba Data Mining', date: '2026-12-10', location: 'Ruang Seminar' },
]

function DaftarEvent({ events, onAdd, onDelete, onUpdate }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')

  // State untuk kontrol Modal Edit
  const [editingEvent, setEditingEvent] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editLocation, setEditLocation] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !date || !location.trim()) {
      setError('Semua kolom wajib diisi.')
      return
    }
    onAdd({ id: crypto.randomUUID(), title: title.trim(), date, location: location.trim() })
    setTitle(''); setDate(''); setLocation(''); setError('')
  }

  function startEdit(event) {
    setEditingEvent(event)
    setEditTitle(event.title)
    setEditDate(event.date)
    setEditLocation(event.location)
  }

  function handleSaveEdit(e) {
    e.preventDefault()
    if (!editTitle.trim() || !editDate || !editLocation.trim()) return
    onUpdate({
      ...editingEvent,
      title: editTitle.trim(),
      date: editDate,
      location: editLocation.trim()
    })
    setEditingEvent(null)
  }

  return (
    <section>
      <h2>Daftar Acara Kampus ({events.length})</h2>
      
      {/* Form Tambah Event */}
      <form onSubmit={handleSubmit} className="form-input">
        <input aria-label="Nama acara" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama acara" />
        <input aria-label="Tanggal acara" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input aria-label="Lokasi acara" value={location} onChange={e => setLocation(e.target.value)} placeholder="Lokasi" />
        <button type="submit" className="btn-primary">Tambah Acara</button>
        {error && <p role="alert">{error}</p>}
      </form>

      {/* Tampilan Tabel Event */}
      {events.length === 0 ? (
        <p>Belum ada acara.</p>
      ) : (
        <div className="event-table-wrap">
          <table className="event-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Acara</th>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/event/${event.id}`} className="event-title-link">
                      {event.title}
                    </Link>
                  </td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    <button onClick={() => startEdit(event)} className="btn-edit">Edit</button>
                    <button onClick={() => onDelete(event.id)} className="btn-delete">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Popup Form Edit */}
      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Acara</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Nama Acara:</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tanggal:</label>
                <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Lokasi:</label>
                <input value={editLocation} onChange={e => setEditLocation(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Simpan</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="btn-secondary">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function DetailEvent({ events }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = events.find(item => item.id === id)
  if (!event) return <p>Acara tidak ditemukan. <Link to="/">Kembali</Link></p>
  return <section className="detail-card">
    <h2>{event.title}</h2>
    <p><strong>Tanggal:</strong> {event.date}</p>
    <p><strong>Lokasi:</strong> {event.location}</p>
    <button onClick={() => navigate('/')} className="btn-secondary">Kembali ke daftar</button>
  </section>
}

function Tentang() {
  return <section><h2>Tentang</h2><p>Praktikum React: Hooks, Routing, & Data Management.</p></section>
}

function NotFound() { return <p>404 - Halaman tidak ditemukan. <Link to="/">Beranda</Link></p> }

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('event-kampus-v1'))
      return Array.isArray(saved) ? saved : contoh
    } catch { return contoh }
  })

  useEffect(() => {
    localStorage.setItem('event-kampus-v1', JSON.stringify(events))
  }, [events])

  function addEvent(event) { setEvents(prev => [...prev, event]) }
  function deleteEvent(id) { setEvents(prev => prev.filter(event => event.id !== id)) }
  function updateEvent(updatedEvent) {
    setEvents(prev => prev.map(item => item.id === updatedEvent.id ? updatedEvent : item))
  }

  return <main className="app">
    <header className="app-header">
      <h1>Event Kampus</h1>
      <nav className="main-nav" aria-label="Navigasi utama">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Daftar Event
        </NavLink>
        <NavLink to="/tentang" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Tentang
        </NavLink>
      </nav>
    </header>
    <Routes>
      <Route path="/" element={<DaftarEvent events={events} onAdd={addEvent} onDelete={deleteEvent} onUpdate={updateEvent} />} />
      <Route path="/event/:id" element={<DetailEvent events={events} />} />
      <Route path="/tentang" element={<Tentang />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
}
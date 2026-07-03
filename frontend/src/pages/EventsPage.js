import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const EVENT_IMGS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80',
  'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&q=80',
];

function EventCard({ event, upcoming, index }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
        <img
          src={EVENT_IMGS[index % EVENT_IMGS.length]}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', filter: upcoming ? 'none' : 'grayscale(30%)' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(13,31,26,0.75))' }} />
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          {upcoming
            ? <span style={{ background: '#00b894', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Upcoming</span>
            : <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)' }}>Past Event</span>
          }
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaCalendarAlt style={{ fontSize: 11, color: upcoming ? '#00b894' : 'rgba(255,255,255,0.7)' }} />
          <span style={{ fontSize: '0.78rem', color: upcoming ? '#00b894' : 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flexGrow: 1, background: '#fff' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', color: '#0d1f1a', marginBottom: 10, lineHeight: 1.35 }}>{event.title}</h3>
        <p style={{ color: '#3d5a52', fontSize: '0.88rem', lineHeight: 1.7, flexGrow: 1, marginBottom: 16 }}>{event.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#8fa89f', fontSize: '0.82rem', marginBottom: upcoming ? 16 : 0 }}>
          <FaMapMarkerAlt style={{ fontSize: 11, color: '#00b894', flexShrink: 0 }} />{event.location}
        </div>
        {upcoming && (
          <Link to="/contact" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 4, padding: '10px 20px', borderRadius: 999,
            background: 'transparent', color: '#00b894',
            border: '1.5px solid rgba(0,184,148,0.35)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.84rem',
            transition: 'all 0.2s', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00b894'; }}
          >
            Register Interest <FaArrowRight style={{ fontSize: 10 }} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/events').then(r => { setEvents(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => e.type === 'upcoming');
  const past = events.filter(e => e.type === 'past');

  return (
    <div style={{ paddingTop: 80 }}>

      {/* Hero */}
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label">Events & Conferences</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Promotional <span>Events</span></h1>
          <p className="section-subtitle">Join us at our events to see live AI demonstrations and connect with industry leaders.</p>
        </div>
      </section>

      {loading ? <div className="spinner" style={{ marginTop: 60 }} /> : (
        <>
          {upcoming.length > 0 && (
            <section className="section" style={{ background: 'linear-gradient(180deg,#f0fdf9,#fff)' }}>
              <div className="container">
                <div style={{ marginBottom: 40 }}>
                  <div className="section-label">Don't Miss Out</div>
                  <h2 className="section-title" style={{ textAlign: 'left', marginTop: 12 }}>Upcoming <span>Events</span></h2>
                </div>
                <div className="grid-3">
                  {upcoming.map((e, i) => <EventCard key={e.id} event={e} upcoming={true} index={i} />)}
                </div>
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="section" style={{ background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
              <div className="container" style={{ position: 'relative' }}>
                <div style={{ marginBottom: 40 }}>
                  <div className="section-label">Our History</div>
                  <h2 className="section-title" style={{ textAlign: 'left', marginTop: 12 }}>Past <span>Events</span></h2>
                </div>
                <div className="grid-3">
                  {past.map((e, i) => <EventCard key={e.id} event={e} upcoming={false} index={i + upcoming.length} />)}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
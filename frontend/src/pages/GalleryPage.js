import React, { useEffect, useState } from 'react';
import { FaTimes, FaExpand } from 'react-icons/fa';
import API from '../utils/api';

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80',
  'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=600&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
];
const GALLERY_IMGS_LG = GALLERY_IMGS.map(u => u.replace('w=600', 'w=1200'));

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterEvent, setFilterEvent] = useState('All');

  useEffect(() => {
    API.get('/gallery').then(r => { setGallery(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const events = ['All', ...new Set(gallery.map(g => g.event_name))];
  const filtered = filterEvent === 'All' ? gallery : gallery.filter(g => g.event_name === filterEvent);

  return (
    <div style={{ paddingTop: 80 }}>

      {/* Hero */}
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label">Photo Gallery</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Event <span>Gallery</span></h1>
          <p className="section-subtitle">Highlights and memories from our promotional events and conferences.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(180deg,#f0fdf9,#fff)' }}>
        <div className="container">

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            {events.map(ev => (
              <button key={ev} onClick={() => setFilterEvent(ev)} style={{
                padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem',
                background: filterEvent === ev ? '#00b894' : '#fff',
                border: filterEvent === ev ? '1.5px solid #00b894' : '1.5px solid rgba(0,184,148,0.25)',
                color: filterEvent === ev ? '#fff' : '#3d5a52',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                boxShadow: filterEvent === ev ? '0 4px 16px rgba(0,184,148,0.3)' : 'none',
              }}>{ev}</button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setSelected({ item, index: i })}
                  style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(0,184,148,0.12)', transition: 'all 0.3s', position: 'relative', aspectRatio: '4/3', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.4)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,184,148,0.15)'; e.currentTarget.querySelector('.gallery-overlay').style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.12)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.querySelector('.gallery-overlay').style.opacity = '0'; }}
                >
                  <img src={GALLERY_IMGS[i % GALLERY_IMGS.length]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 20%,rgba(13,31,26,0.85))', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16 }}>
                    <FaExpand style={{ position: 'absolute', top: 14, right: 14, color: '#fff', fontSize: 18, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.92rem', color: '#fff', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)' }}>{item.event_name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(13,31,26,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(8px)' }}>
          <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', fontSize: 18 }}>
            <FaTimes />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,184,148,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
            <img src={GALLERY_IMGS_LG[selected.index % GALLERY_IMGS_LG.length]} alt={selected.item.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', display: 'block' }} />
            <div style={{ background: '#fff', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1f1a', marginBottom: 4 }}>{selected.item.title}</h3>
                <p style={{ color: '#8fa89f', fontSize: '0.88rem' }}>{selected.item.event_name}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ padding: '8px 20px', borderRadius: 999, background: '#00b894', border: 'none', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
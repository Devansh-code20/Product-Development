import React, { useEffect, useState } from 'react';
import { FaTrophy, FaIndustry, FaCalendarAlt } from 'react-icons/fa';
import API from '../utils/api';

const CASE_IMGS = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300&q=80',
];

export default function CaseStudiesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    API.get('/solutions/past').then(r => { setCases(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const industries = ['All', ...new Set(cases.map(c => c.industry))];
  const filtered = filter === 'All' ? cases : cases.filter(c => c.industry === filter);

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero with green tint + dot grid */}
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label">Proven Results</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Past <span>Solutions</span></h1>
          <p className="section-subtitle">Real challenges. Real solutions. Measurable impact.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(180deg,#f0fdf9,#fff)' }}>
        <div className="container">
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            {industries.map(ind => (
              <button key={ind} onClick={() => setFilter(ind)} style={{
                padding: '8px 22px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem',
                background: filter === ind ? '#00b894' : '#fff',
                border: filter === ind ? '1.5px solid #00b894' : '1.5px solid rgba(0,184,148,0.25)',
                color: filter === ind ? '#fff' : '#3d5a52',
                transition: 'all 0.2s',
                boxShadow: filter === ind ? '0 4px 16px rgba(0,184,148,0.3)' : 'none',
              }}>{ind}</button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filtered.map((c, i) => (
                <div key={c.id} style={{
                  display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: 28,
                  alignItems: 'center', background: '#fff',
                  border: '1px solid rgba(0,184,148,0.12)', borderRadius: 22,
                  overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,184,148,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.12)'; }}
                >
                  <div style={{ height: '100%', minHeight: 180, overflow: 'hidden' }}>
                    <img src={CASE_IMGS[i % CASE_IMGS.length]} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '28px 0' }}>
                    <span className="badge badge-blue" style={{ marginBottom: 12 }}>{c.industry}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.08rem', color: '#0d1f1a', marginBottom: 10 }}>{c.title}</h3>
                    <p style={{ color: '#3d5a52', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: 14 }}>{c.description}</p>
                    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8fa89f', fontSize: '0.82rem' }}><FaIndustry style={{ fontSize: 11 }} />{c.client}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8fa89f', fontSize: '0.82rem' }}><FaCalendarAlt style={{ fontSize: 11 }} />{c.year}</span>
                    </div>
                  </div>
                  <div style={{ padding: '28px 28px 28px 0' }}>
                    <div style={{ background: '#f0fdf9', border: '1px solid rgba(0,184,148,0.2)', borderRadius: 14, padding: 20 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <FaTrophy style={{ color: '#00b894', flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem', color: '#00b894', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Outcome</div>
                          <p style={{ color: '#3d5a52', fontSize: '0.86rem', lineHeight: 1.65 }}>{c.result}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowRight, FaTag } from 'react-icons/fa';
import API from '../utils/api';

const ARTICLE_IMGS = [
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    API.get('/articles').then(r => { setArticles(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(articles.map(a => a.category))];
  const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label">Insights & News</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>Articles & <span>Blog</span></h1>
          <p className="section-subtitle">Stay updated with the latest AI trends, case studies, and industry insights from our experts.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(180deg,#f0fdf9,#fff)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '8px 22px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.84rem',
                background: filter === cat ? '#00b894' : '#fff',
                border: filter === cat ? '1.5px solid #00b894' : '1.5px solid rgba(0,184,148,0.25)',
                color: filter === cat ? '#fff' : '#3d5a52',
                transition: 'all 0.2s',
                boxShadow: filter === cat ? '0 4px 16px rgba(0,184,148,0.3)' : 'none',
              }}>{cat}</button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="grid-3">
              {filtered.map((article, i) => (
                <div key={article.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img src={ARTICLE_IMGS[i % ARTICLE_IMGS.length]} alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(13,31,26,0.7))' }} />
                    <div style={{ position: 'absolute', top: 14, left: 14 }}>
                      <span style={{ background: '#00b894', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', color: '#0d1f1a', marginBottom: 10, lineHeight: 1.4 }}>{article.title}</h3>
                    <p style={{ color: '#3d5a52', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 20, flexGrow: 1 }}>{article.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(0,184,148,0.1)', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8fa89f', fontSize: '0.78rem' }}><FaUser style={{ fontSize: 10 }} />{article.author}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8fa89f', fontSize: '0.78rem' }}><FaCalendarAlt style={{ fontSize: 10 }} />{new Date(article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <Link to={`/articles/${article.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#00b894', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.83rem' }}>
                        Read More <FaArrowRight style={{ fontSize: 10 }} />
                      </Link>
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
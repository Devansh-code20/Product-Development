import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaArrowLeft, FaTag } from 'react-icons/fa';
import API from '../utils/api';

const ARTICLE_IMGS = [
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
];

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/articles/${id}`).then(r => { setArticle(r.data); setLoading(false); }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!article) return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-primary)' }}>Article not found.</h2>
      <Link to="/articles" className="btn btn-outline" style={{ marginTop: 20 }}>Back to Articles</Link>
    </div>
  );

  const imgIndex = (article.id - 1) % ARTICLE_IMGS.length;

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero image */}
      <div style={{ height: 380, position: 'relative', overflow: 'hidden' }}>
        <img src={ARTICLE_IMGS[imgIndex]} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,12,16,0.3) 0%, rgba(11,12,16,0.85) 100%)' }} />
        <div className="container" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', paddingBottom: 40 }}>
          <Link to="/articles" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', marginBottom: 16, fontSize: '0.88rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            <FaArrowLeft /> Back to Articles
          </Link>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: 12, display: 'inline-block' }}>
              <FaTag style={{ fontSize: 9, marginRight: 4 }} />{article.category}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff', maxWidth: 760, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px', maxWidth: 820 }}>
        <div style={{ display: 'flex', gap: 24, marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <FaUser style={{ color: 'var(--accent-secondary)' }} />{article.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <FaCalendarAlt style={{ color: 'var(--accent-secondary)' }} />
            {new Date(article.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.85, marginBottom: 32, fontStyle: 'italic', borderLeft: '3px solid var(--accent-primary)', paddingLeft: 20 }}>
          {article.excerpt}
        </p>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.95 }}>
          {article.content.split('\n').map((para, i) => para.trim() && (
            <p key={i} style={{ marginBottom: 22 }}>{para}</p>
          ))}
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/articles" className="btn btn-outline"><FaArrowLeft /> All Articles</Link>
          <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
        </div>
      </div>
    </div>
  );
}

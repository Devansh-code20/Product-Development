import React, { useEffect, useState } from 'react';
import { FaRobot, FaChartLine, FaCogs, FaFileAlt, FaBrain, FaShieldAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const SOLUTION_IMGS = [
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600&q=80',
  'https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=600&q=80',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
];

const iconList = [FaRobot, FaChartLine, FaCogs, FaFileAlt, FaBrain, FaShieldAlt];

const cardColors = [
  ['#e6fff9', '#00b894'],
  ['#f0fdf4', '#059669'],
  ['#fff7ed', '#ea580c'],
  ['#eff6ff', '#2563eb'],
  ['#fdf4ff', '#9333ea'],
  ['#f0fdf9', '#00cba9'],
];

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/solutions').then(r => { setSolutions(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 80 }}>

      {/* Hero */}
      <section style={{
        padding: '80px 0 60px', textAlign: 'center',
        background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,203,169,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-label">Our Expertise</div>
          <h1 className="section-title" style={{ marginTop: 12 }}>AI Software <span>Solutions</span></h1>
          <p className="section-subtitle">We deliver intelligent, scalable software solutions across industries — from virtual assistants to predictive analytics.</p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section" style={{ background: 'linear-gradient(180deg,#f0fdf9,#fff)' }}>
        <div className="container">
          {loading ? <div className="spinner" /> : (
            <div className="grid-3">
              {solutions.map((s, i) => {
                const Icon = iconList[i % iconList.length];
                const [bg, clr] = cardColors[i % cardColors.length];
                return (
                  <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <img src={SOLUTION_IMGS[i % SOLUTION_IMGS.length]} alt={s.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(13,31,26,0.7))' }} />
                      <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                        <span style={{ background: '#00b894', color: '#fff', padding: '4px 12px', borderRadius: 999, fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{s.industry}</span>
                      </div>
                    </div>
                    <div style={{ padding: 24, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, border: `1px solid ${clr}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: clr, marginBottom: 14, transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'rotate(-5deg) scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0) scale(1)'}
                      ><Icon /></div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10, color: '#0d1f1a' }}>{s.title}</h3>
                      <p style={{ color: '#3d5a52', fontSize: '0.88rem', lineHeight: 1.75, flexGrow: 1 }}>{s.description}</p>
                      <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, color: clr, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.84rem', transition: 'gap 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                        onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                      >Request Solution <FaArrowRight style={{ fontSize: 11 }} /></Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(circle,rgba(0,184,148,0.2) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="section-header">
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title">The <span>AI-Solutions</span> Advantage</h2>
          </div>
          <div className="grid-2">
            {[
              ['Rapid Prototyping', 'We go from concept to working prototype in weeks, not months, using agile methods and proven AI frameworks.'],
              ['Industry-Specific AI', 'Our solutions are never off-the-shelf. Every deployment is tailored to your sector, data, and business objectives.'],
              ['Seamless Integration', 'We integrate with your existing stack — CRM, ERP, cloud platforms — with minimal disruption to operations.'],
              ['Ongoing Support', 'Our AI systems improve over time. We provide continuous monitoring, retraining, and feature enhancement.'],
            ].map(([title, desc]) => (
              <div key={title} className="card" style={{ display: 'flex', gap: 18, alignItems: 'flex-start', background: '#fff' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e6fff9', border: '1px solid rgba(0,184,148,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaCheckCircle style={{ color: '#00b894', fontSize: 16 }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8, color: '#0d1f1a' }}>{title}</h4>
                  <p style={{ color: '#3d5a52', fontSize: '0.9rem', lineHeight: 1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
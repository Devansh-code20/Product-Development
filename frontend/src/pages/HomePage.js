import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight, FaBolt, FaChartLine, FaShieldAlt, FaBrain,
  FaUsers, FaBriefcase, FaGlobe, FaStar, FaCheckCircle,
  FaRobot, FaCogs, FaFileAlt
} from 'react-icons/fa';
import API from '../utils/api';

const iconList = [FaRobot, FaChartLine, FaCogs, FaFileAlt, FaBrain, FaShieldAlt];
const GRAD = 'linear-gradient(135deg,#00b894,#00cba9)';

function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(145deg, #f0fdf9 0%, #e6fff9 40%, #f0f4ff 100%)',
      position: 'relative', overflow: 'hidden', paddingTop: 80,
    }}>
      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: 'radial-gradient(circle, rgba(0,184,148,0.2) 1px, transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />

      {/* Soft blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,184,148,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,203,169,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>

          {/* Label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,184,148,0.25)', borderRadius: 999,
            padding: '8px 20px', marginBottom: 32,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b894', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: '#007a62', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              AI-Powered Business Solutions
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,6vw,5rem)',
            fontWeight: 900, lineHeight: 1.05, color: '#0d1f1a',
            marginBottom: 24, letterSpacing: '-0.04em',
          }}>
            Innovate, Promote &<br />
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Deliver the Future
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#3d5a52', lineHeight: 1.85, maxWidth: 560, margin: '0 auto 40px', fontWeight: 400 }}>
            AI-Solutions leverages artificial intelligence to rapidly address issues impacting the digital employee experience — speeding up design, engineering, and innovation worldwide.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              background: '#00b894', color: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
              boxShadow: '0 6px 24px rgba(0,184,148,0.4)',
              transition: 'all 0.25s', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,184,148,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,184,148,0.4)'; }}
            >
              Free Consultation <FaArrowRight style={{ fontSize: 13 }} />
            </Link>
            <Link to="/solutions" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 999,
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
              color: '#0d1f1a', border: '1.5px solid rgba(0,0,0,0.12)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
              transition: 'all 0.25s', textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Explore Solutions
            </Link>
          </div>

          {/* Trust stats */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center', paddingTop: 32, borderTop: '1px solid rgba(0,184,148,0.15)' }}>
            {[['100+', 'Clients Worldwide'], ['98%', 'Satisfaction Rate'], ['£50M+', 'Client Savings'], ['24/7', 'AI Support']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>{n}</div>
                <div style={{ fontSize: '0.78rem', color: '#8fa89f', fontWeight: 600, letterSpacing: '0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const brands = ['TechCorp UK', 'NorthBank PLC', 'SteelWorks Ltd', 'RetailNation', 'GlobalHire Inc', 'HealthFirst NHS'];
  return (
    <div style={{ background: '#fff', borderTop: '1px solid rgba(0,184,148,0.08)', borderBottom: '1px solid rgba(0,184,148,0.08)', padding: '20px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#8fa89f', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Trusted By</span>
          {brands.map(b => (
            <span key={b} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: '#c5d8d2', letterSpacing: '-0.01em', transition: 'color 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.target.style.color = '#00b894'}
              onMouseLeave={e => e.target.style.color = '#c5d8d2'}
            >{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolutionsPreview() {
  const [solutions, setSolutions] = useState([]);
  useEffect(() => { API.get('/solutions').then(r => setSolutions(r.data.slice(0, 6))).catch(() => {}); }, []);

  const colors = [
    ['#e6fff9', '#00b894'], ['#f0fdf4', '#059669'], ['#fff7ed', '#ea580c'],
    ['#eff6ff', '#2563eb'], ['#fdf4ff', '#9333ea'], ['#f0fdf9', '#00cba9'],
  ];

  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Solutions That <span>Drive Results</span></h2>
          <p className="section-subtitle">From AI virtual assistants to predictive analytics, we deliver intelligent solutions tailored to your industry.</p>
        </div>
        <div className="grid-3">
          {solutions.map((s, i) => {
            const Icon = iconList[i % iconList.length];
            const [bg, clr] = colors[i % colors.length];
            return (
              <div key={s.id} className="card">
                <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: clr, marginBottom: 20, transition: 'transform 0.3s', border: `1px solid ${clr}22` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'rotate(-5deg) scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0) scale(1)'}
                ><Icon /></div>
                <span className="badge badge-blue" style={{ marginBottom: 12 }}>{s.industry}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.08rem', marginBottom: 10, color: '#0d1f1a', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ color: '#3d5a52', fontSize: '0.9rem', lineHeight: 1.75 }}>{s.description}</p>
                <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, color: clr, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.84rem', transition: 'gap 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                >Learn more <FaArrowRight style={{ fontSize: 11 }} /></Link>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/solutions" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 999,
            background: 'transparent', color: '#00b894',
            border: '2px solid rgba(0,184,148,0.35)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem',
            transition: 'all 0.25s', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,184,148,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >View All Solutions <FaArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    [FaUsers, '500+', 'Projects Delivered', '#e6fff9', '#00b894'],
    [FaBriefcase, '15+', 'Industry Sectors', '#f0fdf4', '#059669'],
    [FaGlobe, '30+', 'Countries Served', '#fff7ed', '#ea580c'],
    [FaStar, '4.9/5', 'Average Rating', '#eff6ff', '#2563eb'],
  ];
  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)' }}>
      <div className="container">
        <div className="grid-4">
          {stats.map(([Icon, stat, label, bg, clr]) => (
            <div key={label} style={{
              textAlign: 'center', padding: '36px 20px',
              background: '#fff', border: `1px solid ${clr}22`,
              borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${clr}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ width: 58, height: 58, borderRadius: 18, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: clr, margin: '0 auto 16px', border: `1px solid ${clr}33` }}><Icon /></div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: '#0d1f1a', marginBottom: 6, letterSpacing: '-0.03em' }}>{stat}</div>
              <div style={{ color: '#8fa89f', fontSize: '0.88rem', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => { API.get('/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {}); }, []);
  return (
    <section className="section" style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Client Feedback</div>
          <h2 className="section-title">What Our <span>Clients Say</span></h2>
        </div>
        <div className="grid-3">
          {testimonials.map(t => (
            <div key={t.id} className="card">
              <div className="stars" style={{ marginBottom: 16 }}>{Array.from({ length: t.rating }).map((_, i) => <FaStar key={i} />)}</div>
              <p style={{ color: '#3d5a52', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: 24, fontStyle: 'italic' }}>"{t.message}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(0,184,148,0.1)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: '1rem', flexShrink: 0 }}>{t.client_name.charAt(0)}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#0d1f1a' }}>{t.client_name}</div>
                  <div style={{ color: '#8fa89f', fontSize: '0.8rem' }}>{t.position}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ padding: '96px 0', background: 'linear-gradient(145deg,#f0fdf9,#e6fff9)' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg,#00b894,#00cba9)',
          borderRadius: 32, padding: '72px 48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,184,148,0.3)',
        }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-3%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '6px 18px', marginBottom: 20, fontSize: '0.72rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
              Ready to Get Started?
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem,4vw,3rem)', fontWeight: 900, marginBottom: 16, color: '#fff', letterSpacing: '-0.03em' }}>Have a Project in Mind?</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.08rem', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.85 }}>
              Tell us about your requirements and our team will craft a tailored AI solution just for you.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 36px', borderRadius: 999,
                background: '#fff', color: '#00b894',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                transition: 'all 0.25s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
              >Contact Us Today <FaArrowRight /></Link>
              <Link to="/case-studies" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 999,
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
                transition: 'all 0.25s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >View Case Studies</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustedBy />
      <SolutionsPreview />
      <StatsSection />
      <TestimonialsPreview />
      <CTASection />
    </div>
  );
}
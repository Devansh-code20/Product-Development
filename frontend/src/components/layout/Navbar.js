import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaLock } from 'react-icons/fa';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Articles', to: '/articles' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [location]);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.07)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #00b894', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#00b894', fontWeight: 900, fontFamily: 'var(--font-display)' }}>AI</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#0d1f1a', letterSpacing: '-0.02em' }}>
            AI<span style={{ color: '#00b894' }}>Solutions</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
          {navLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{
                padding: '7px 14px', borderRadius: 999,
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem',
                color: active ? '#00b894' : '#3d5a52',
                background: active ? 'rgba(0,184,148,0.08)' : 'transparent',
                border: active ? '1px solid rgba(0,184,148,0.2)' : '1px solid transparent',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#0d1f1a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#3d5a52'; e.currentTarget.style.background = 'transparent'; }}}
              >{link.label}</Link>
            );
          })}

          {/* Admin button */}
          <Link to="/admin/login" style={{
            marginLeft: 4, padding: '7px 14px', borderRadius: 999,
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.86rem',
            color: '#8fa89f', background: 'transparent',
            border: '1px solid transparent',
            transition: 'all 0.2s', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0d1f1a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8fa89f'; e.currentTarget.style.background = 'transparent'; }}
          >
            <FaLock style={{ fontSize: 11 }} /> Admin
          </Link>

          {/* Get Started button */}
          <Link to="/contact" style={{
            marginLeft: 8, padding: '10px 24px', borderRadius: 999,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
            background: '#00b894', color: '#fff',
            boxShadow: '0 4px 16px rgba(0,184,148,0.3)',
            textDecoration: 'none', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00a882'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,184,148,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,184,148,0.3)'; }}
          >Get Started</Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(o => !o)} className="mobile-toggle"
          style={{ background: 'none', border: 'none', fontSize: 22, color: '#0d1f1a', cursor: 'pointer', display: 'none' }}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 24px 24px' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'block', padding: '13px 0', borderBottom: '1px solid rgba(0,0,0,0.05)',
              color: location.pathname === link.to ? '#00b894' : '#3d5a52',
              fontFamily: 'var(--font-display)', fontWeight: 600, textDecoration: 'none',
            }}>{link.label}</Link>
          ))}
          <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#8fa89f', fontFamily: 'var(--font-display)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            <FaLock style={{ fontSize: 11 }} /> Admin
          </Link>
          <Link to="/contact" style={{ display: 'block', marginTop: 16, padding: '13px', borderRadius: 999, background: '#00b894', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, textDecoration: 'none' }}>Get Started</Link>
        </div>
      )}
      <style>{`@media(max-width:960px){.desktop-nav{display:none!important}.mobile-toggle{display:block!important}}`}</style>
    </nav>
  );
}
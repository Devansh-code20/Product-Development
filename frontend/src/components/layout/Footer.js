import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ background: '#0d1f1a', paddingTop: 64 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>

          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #00b894', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#00b894', fontWeight: 900, fontFamily: 'var(--font-display)' }}>AI</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                AI<span style={{ color: '#00b894' }}>Solutions</span>
              </span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.85, maxWidth: 280, marginBottom: 24 }}>
              Innovating the future of digital employee experience through AI-powered software solutions.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FaLinkedin, FaTwitter, FaGithub].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,184,148,0.2)'; e.currentTarget.style.color = '#00b894'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {[
            ['Company', [['Home','/'],['Solutions','/solutions'],['Case Studies','/case-studies'],['Articles','/articles'],['Events','/events']]],
            ['Solutions', [['Virtual Assistant','/solutions'],['AI Prototyping','/solutions'],['Software Consulting','/solutions'],['Digital Experience','/solutions']]],
            ['Contact', null],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{title}</h4>
              {title === 'Contact' ? (
                <div>
                  {[
                    [FaMapMarkerAlt,'Sunderland, SR1 1PP\nUnited Kingdom'],
                    [FaEnvelope,'info@ai-solutions.co.uk'],
                    [FaPhone,'+44 191 000 0000'],
                  ].map(([Icon,text],i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 12 }}>
                      <Icon style={{ color: '#00b894', marginTop: 3, flexShrink: 0, fontSize: 12 }} />
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.86rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{text}</span>
                    </div>
                  ))}
                </div>
              ) : links.map(([label, to]) => (
                <Link key={label} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '0.86rem', marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#00b894'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>© {new Date().getFullYear()} AI-Solutions Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy','Terms of Service','Cookies'].map(item => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#00b894'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>{item}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important}}@media(max-width:600px){footer .container > div:first-child{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaPaperPlane, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mexico',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain',
  'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other'
];
const CONTACT_IMG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';
const initialForm = { name:'',email:'',phone:'',company_name:'',country:'',job_title:'',job_details:'' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    if (!form.company_name.trim()) errs.company_name = 'Company name is required.';
    if (!form.country) errs.country = 'Please select your country.';
    if (!form.job_title.trim()) errs.job_title = 'Job title is required.';
    if (!form.job_details.trim()) errs.job_details = 'Please describe your requirements.';
    else if (form.job_details.trim().length < 20) errs.job_details = 'Please provide more detail (at least 20 characters).';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please fix the errors before submitting.'); return; }
    setSubmitting(true);
    try {
      await API.post('/inquiries', form);
      setSubmitted(true);
      setForm(initialForm);
      toast.success('Your enquiry has been submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <div style={{ paddingTop: 80, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32, color: '#10b981' }}>
          <FaCheckCircle />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-0.02em' }}>Enquiry Received!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.85, marginBottom: 32 }}>
          Thank you for reaching out. A member of our team will review your requirements and respond within 1–2 business days.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another Enquiry</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero with image */}
      <section style={{ height: 300, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img src={CONTACT_IMG} alt="Office" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,12,16,0.85), rgba(124,106,255,0.3))' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label">Get In Touch</div>
          <h1 className="section-title" style={{ marginTop: 12, marginBottom: 12 }}>Contact <span>Us</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 520, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
            Tell us about your project and we'll respond with a tailored AI solution proposal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }} className="contact-grid">
            {/* Info */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 28 }}>Contact Information</h3>
              {[
                [FaMapMarkerAlt,'Address','Sunderland, SR1 1PP\nUnited Kingdom'],
                [FaEnvelope,'Email','info@ai-solutions.co.uk'],
                [FaPhone,'Phone','+44 191 000 0000'],
                [FaClock,'Hours','Mon–Fri: 9:00am – 6:00pm GMT'],
              ].map(([Icon,label,value]) => (
                <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(124,106,255,0.1)', border: '1px solid rgba(124,106,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', fontSize: 16 }}><Icon /></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{value}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(124,106,255,0.06)', border: '1px solid rgba(124,106,255,0.15)', borderRadius: 14, padding: 22, marginTop: 8 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Response Time</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  We aim to respond within <strong style={{ color: 'var(--accent-secondary)' }}>1–2 business days</strong>. For urgent matters, call us directly.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: 40 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.02em' }}>Submit Your Enquiry</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32 }}>No account required. Fill in your details and job requirements below.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+44 7700 000000" />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input className="form-input" name="company_name" value={form.company_name} onChange={handleChange} placeholder="Your Company Ltd" />
                    {errors.company_name && <div className="form-error">{errors.company_name}</div>}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <select className="form-select" name="country" value={form.country} onChange={handleChange}>
                      <option value="">Select your country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <div className="form-error">{errors.country}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input className="form-input" name="job_title" value={form.job_title} onChange={handleChange} placeholder="e.g. Head of Technology" />
                    {errors.job_title && <div className="form-error">{errors.job_title}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Details / Requirements *</label>
                  <textarea className="form-textarea" name="job_details" value={form.job_details} onChange={handleChange}
                    placeholder="Please describe your project requirements, the problem you are trying to solve, and any specific AI solutions you are interested in..." rows={6} />
                  {errors.job_details && <div className="form-error">{errors.job_details}</div>}
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 5 }}>{form.job_details.length} / 2000 characters</div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
                  By submitting this form, you agree to our Privacy Policy. We will use your information solely to respond to your enquiry.
                </p>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: 14 }}>
                  {submitting ? 'Submitting...' : <><FaPaperPlane /> Submit Enquiry</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

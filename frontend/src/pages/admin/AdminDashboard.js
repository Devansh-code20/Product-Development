import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaGlobe, FaBuilding, FaSignOutAlt, FaRobot,
  FaEye, FaTrash, FaChartBar, FaUsers, FaTimes, FaPlus,
  FaEdit, FaImages, FaNewspaper, FaCalendarAlt, FaStar,
  FaTools, FaCheck
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const COLORS = ['#00b894','#00cba9','#059669','#ffd700','#ff6b6b','#a78bfa','#fb923c','#34d399'];

// ── Styles ──────────────────────────────────────────────────────────────────
const cardStyle = {
  background: '#fff', border: '1px solid rgba(0,184,148,0.12)',
  borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  marginBottom: 20,
};
const inputStyle = {
  width: '100%', background: '#f7faf9',
  border: '1.5px solid rgba(0,184,148,0.2)', borderRadius: 10,
  padding: '10px 14px', color: '#0d1f1a',
  fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box', marginBottom: 10,
};
const btnG = (active) => ({
  padding: '9px 20px', borderRadius: 999, cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem',
  background: active ? '#00b894' : 'rgba(255,255,255,0.06)',
  border: active ? 'none' : '1px solid var(--border-color)',
  color: active ? '#fff' : '#3d5a52', transition: 'all 0.2s',
  marginRight: 6,
});
const tealBtn = { background: '#00b894', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: 6 };
const dangerBtn = { background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: 6, padding: '5px 10px', color: '#ff6b6b', cursor: 'pointer', fontSize: 13 };
const editBtn = { background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.2)', borderRadius: 6, padding: '5px 10px', color: '#00b894', cursor: 'pointer', fontSize: 13, marginRight: 6 };

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#0d1f1a' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8fa89f' }}><FaTimes /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', placeholder = '', rows }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: '#3d5a52', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: 'vertical', marginBottom: 0 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, marginBottom: 0 }} />
      )}
    </div>
  );
}

// ── Tab: Enquiries ────────────────────────────────────────────────────────────
function EnquiriesTab({ data, onDelete }) {
  const [selected, setSelected] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const openReply = (inq) => {
    setReplyModal(inq);
    setEmailForm({
      subject: `Re: Your Enquiry to AI-Solutions — ${inq.job_title}`,
      message: `Thank you for reaching out to AI-Solutions.\n\nWe have received your enquiry regarding "${inq.job_title}" and our team is reviewing your requirements.\n\nWe will be in touch shortly to discuss how we can help ${inq.company_name} achieve its goals with our AI solutions.\n\nIf you have any immediate questions, please don't hesitate to reply to this email.\n\nWarm regards,\nThe AI-Solutions Team`,
    });
  };

  const sendEmail = async () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Subject and message are required.');
      return;
    }
    setSending(true);
    try {
      await API.post('/email/send', {
        to: replyModal.email,
        toName: replyModal.name,
        subject: emailForm.subject,
        message: emailForm.message,
      });
      toast.success(`✅ Email sent to ${replyModal.email}`);
      setReplyModal(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send email.');
    }
    setSending(false);
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#0d1f1a', marginBottom:20 }}>
        All Enquiries <span style={{ color:'#00b894', fontSize:'0.9rem' }}>({data?.stats?.total || 0})</span>
      </h3>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.86rem' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid rgba(0,184,148,0.15)' }}>
              {['#','Name','Email','Company','Country','Date','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:'#8fa89f', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.inquiries || []).map((inq, idx) => (
              <tr key={inq.id}
                style={{ borderBottom:'1px solid rgba(0,0,0,0.04)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7faf9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding:'11px 12px', color:'#8fa89f' }}>{idx + 1}</td>
                <td style={{ padding:'11px 12px', color:'#0d1f1a', fontWeight:600 }}>{inq.name}</td>
                <td style={{ padding:'11px 12px', color:'#3d5a52' }}>{inq.email}</td>
                <td style={{ padding:'11px 12px', color:'#3d5a52' }}>{inq.company_name}</td>
                <td style={{ padding:'11px 12px', color:'#3d5a52' }}>{inq.country}</td>
                <td style={{ padding:'11px 12px', color:'#8fa89f' }}>{new Date(inq.created_at).toLocaleDateString('en-GB')}</td>
                <td style={{ padding:'11px 12px', display:'flex', gap:6 }}>
                  {/* View button */}
                  <button
                    onClick={() => setSelected(inq)}
                    title="View details"
                    style={{ background:'rgba(0,184,148,0.1)', border:'1px solid rgba(0,184,148,0.2)', borderRadius:6, padding:'5px 10px', color:'#00b894', cursor:'pointer', fontSize:13 }}
                  >
                    👁
                  </button>
                  {/* Reply / Send Email button */}
                  <button
                    onClick={() => openReply(inq)}
                    title={`Send email to ${inq.email}`}
                    style={{ background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:6, padding:'5px 10px', color:'#2563eb', cursor:'pointer', fontSize:13 }}
                  >
                    ✉ Reply
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => onDelete('inquiries', inq.id)}
                    title="Delete enquiry"
                    style={{ background:'rgba(255,100,100,0.1)', border:'1px solid rgba(255,100,100,0.2)', borderRadius:6, padding:'5px 10px', color:'#ff6b6b', cursor:'pointer', fontSize:13 }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {!data?.inquiries?.length && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#8fa89f' }}>No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── View Detail Modal ── */}
      {selected && (
        <Modal title="Enquiry Details" onClose={() => setSelected(null)}>
          {[
            ['Name', selected.name],
            ['Email', selected.email],
            ['Phone', selected.phone],
            ['Company', selected.company_name],
            ['Country', selected.country],
            ['Job Title', selected.job_title],
            ['Date', new Date(selected.created_at).toLocaleString('en-GB')],
          ].map(([label, value]) => (
            <div key={label} style={{ display:'flex', gap:12, marginBottom:10, borderBottom:'1px solid #f0f0f0', paddingBottom:8 }}>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.78rem', color:'#8fa89f', minWidth:90, textTransform:'uppercase' }}>{label}</span>
              <span style={{ color:'#0d1f1a', fontSize:'0.9rem' }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop:12 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.78rem', color:'#8fa89f', marginBottom:8, textTransform:'uppercase' }}>Job Details</div>
            <div style={{ background:'#f7faf9', border:'1px solid rgba(0,184,148,0.15)', borderRadius:10, padding:14, color:'#3d5a52', fontSize:'0.9rem', lineHeight:1.7 }}>
              {selected.job_details}
            </div>
          </div>
          {/* Quick Reply from view modal */}
          <button
            onClick={() => { setSelected(null); openReply(selected); }}
            style={{ marginTop:16, width:'100%', padding:'10px', borderRadius:10, background:'#2563eb', border:'none', color:'#fff', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.88rem', cursor:'pointer' }}
          >
            ✉  Reply by Email
          </button>
        </Modal>
      )}

      {/* ── Send Email Modal ── */}
      {replyModal && (
        <Modal title={`Reply to ${replyModal.name}`} onClose={() => setReplyModal(null)}>
          {/* Recipient info banner */}
          <div style={{ background:'rgba(37,99,235,0.06)', border:'1px solid rgba(37,99,235,0.15)', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#1e3a8a', fontSize:'0.88rem' }}>{replyModal.name}</div>
                <div style={{ color:'#2563eb', fontSize:'0.82rem' }}>{replyModal.email}</div>
                <div style={{ color:'#8fa89f', fontSize:'0.78rem', marginTop:2 }}>{replyModal.company_name} · {replyModal.country}</div>
              </div>
              <div style={{ fontSize:28 }}>✉</div>
            </div>
          </div>

          {/* Subject field */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.75rem', color:'#3d5a52', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Subject *
            </label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={e => setEmailForm(f => ({ ...f, subject: e.target.value }))}
              style={{ width:'100%', background:'#f7faf9', border:'1.5px solid rgba(0,184,148,0.2)', borderRadius:10, padding:'10px 14px', color:'#0d1f1a', fontFamily:'var(--font-body)', fontSize:'0.88rem', outline:'none', boxSizing:'border-box' }}
            />
          </div>

          {/* Message field */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.75rem', color:'#3d5a52', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Message *
            </label>
            <textarea
              value={emailForm.message}
              onChange={e => setEmailForm(f => ({ ...f, message: e.target.value }))}
              rows={10}
              style={{ width:'100%', background:'#f7faf9', border:'1.5px solid rgba(0,184,148,0.2)', borderRadius:10, padding:'10px 14px', color:'#0d1f1a', fontFamily:'var(--font-body)', fontSize:'0.88rem', outline:'none', resize:'vertical', boxSizing:'border-box', lineHeight:1.7 }}
            />
            <div style={{ fontSize:'0.75rem', color:'#8fa89f', marginTop:4 }}>
              The email will be sent from your Gmail account and arrive in the customer's inbox with professional AI-Solutions branding.
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={sendEmail}
            disabled={sending}
            style={{ width:'100%', padding:'12px', borderRadius:10, background: sending ? '#aaaaaa' : '#2563eb', border:'none', color:'#fff', fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.9rem', cursor: sending ? 'not-allowed' : 'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
          >
            {sending ? (
              <>
                <span style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                Sending...
              </>
            ) : (
              <>✉  Send Email to {replyModal.email}</>
            )}
          </button>

          {/* Spinner keyframe */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Analytics ────────────────────────────────────────────────────────────
function AnalyticsTab({ data }) {
  const countryData = data ? Object.entries(data.stats?.byCountry || {}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value})) : [];
  const monthData = data ? Object.entries(data.stats?.byMonth || {}).sort().map(([name,value])=>({name:name.slice(5),value})) : [];
  return (
    <div>
      <div style={{ ...cardStyle }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a',marginBottom:24 }}><FaChartBar style={{color:'#00b894',marginRight:8}}/>Enquiries by Month</h3>
        {monthData.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,184,148,0.1)" />
              <XAxis dataKey="name" tick={{fill:'#8fa89f',fontSize:12}}/>
              <YAxis tick={{fill:'#8fa89f',fontSize:12}} allowDecimals={false}/>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid rgba(0,184,148,0.2)',borderRadius:10}}/>
              <Bar dataKey="value" fill="#00b894" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={{color:'#8fa89f',textAlign:'center',padding:40}}>No data yet.</p>}
      </div>
      <div style={cardStyle}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a',marginBottom:24 }}>Enquiries by Country</h3>
        {countryData.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={countryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {countryData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid rgba(0,184,148,0.2)',borderRadius:10}}/>
            </PieChart>
          </ResponsiveContainer>
        ) : <p style={{color:'#8fa89f',textAlign:'center',padding:40}}>No data yet.</p>}
      </div>
    </div>
  );
}

// ── Tab: Manage Solutions ─────────────────────────────────────────────────────
function SolutionsTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | item
  const [form, setForm] = useState({ title:'', description:'', industry:'', icon:'FaRobot' });
  const [loading, setLoading] = useState(false);

  const load = () => API.get('/solutions').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (item) => { setForm({ title: item.title, description: item.description, industry: item.industry, icon: item.icon || 'FaRobot' }); setModal(item); };
  const openAdd = () => { setForm({ title:'', description:'', industry:'', icon:'FaRobot' }); setModal('add'); };

  const save = async () => {
    if (!form.title || !form.description || !form.industry) { toast.error('Please fill all required fields.'); return; }
    setLoading(true);
    try {
      if (modal === 'add') {
        await API.post('/solutions', form);
        toast.success('Solution added!');
      } else {
        await API.put(`/solutions/${modal.id}`, form);
        toast.success('Solution updated!');
      }
      setModal(null); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this solution?')) return;
    try { await API.delete(`/solutions/${id}`); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Error deleting.'); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Manage Solutions <span style={{color:'#00b894',fontSize:'0.9rem'}}>({items.length})</span></h3>
        <button onClick={openAdd} style={tealBtn}><FaPlus/> Add Solution</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
        {items.map(item => (
          <div key={item.id} style={{ background:'#f7faf9',border:'1px solid rgba(0,184,148,0.12)',borderRadius:14,padding:20 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10 }}>
              <span style={{ background:'rgba(0,184,148,0.1)',color:'#00b894',padding:'3px 10px',borderRadius:999,fontSize:'0.72rem',fontFamily:'var(--font-display)',fontWeight:700 }}>{item.industry}</span>
              <div>
                <button onClick={() => openEdit(item)} style={editBtn}><FaEdit/></button>
                <button onClick={() => del(item.id)} style={dangerBtn}><FaTrash/></button>
              </div>
            </div>
            <h4 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a',marginBottom:6 }}>{item.title}</h4>
            <p style={{ color:'#3d5a52',fontSize:'0.84rem',lineHeight:1.65 }}>{item.description.substring(0,100)}...</p>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'add' ? 'Add New Solution' : 'Edit Solution'} onClose={() => setModal(null)}>
          <FormField label="Title *" value={form.title} onChange={v => setForm(f=>({...f,title:v}))} placeholder="e.g. AI Virtual Assistant"/>
          <FormField label="Industry *" value={form.industry} onChange={v => setForm(f=>({...f,industry:v}))} placeholder="e.g. Customer Service"/>
          <FormField label="Description *" value={form.description} onChange={v => setForm(f=>({...f,description:v}))} placeholder="Describe this solution..." rows={4}/>
          <FormField label="Icon Name" value={form.icon} onChange={v => setForm(f=>({...f,icon:v}))} placeholder="e.g. FaRobot"/>
          <button onClick={save} disabled={loading} style={{...tealBtn,width:'100%',justifyContent:'center',marginTop:8}}>
            {loading ? 'Saving...' : <><FaCheck/> {modal==='add'?'Add Solution':'Save Changes'}</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Manage Gallery ───────────────────────────────────────────────────────
function GalleryTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:'', image_url:'', event_name:'' });
  const [loading, setLoading] = useState(false);

  const load = () => API.get('/gallery').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (item) => { setForm({ title: item.title, image_url: item.image_url, event_name: item.event_name }); setModal(item); };
  const openAdd = () => { setForm({ title:'', image_url:'', event_name:'' }); setModal('add'); };

  const save = async () => {
    if (!form.title || !form.image_url || !form.event_name) { toast.error('All fields required.'); return; }
    setLoading(true);
    try {
      if (modal === 'add') { await API.post('/gallery', form); toast.success('Photo added!'); }
      else { await API.put(`/gallery/${modal.id}`, form); toast.success('Photo updated!'); }
      setModal(null); load();
    } catch (e) { toast.error('Error saving.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try { await API.delete(`/gallery/${id}`); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Error.'); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Manage Gallery <span style={{color:'#00b894',fontSize:'0.9rem'}}>({items.length} photos)</span></h3>
        <button onClick={openAdd} style={tealBtn}><FaPlus/> Add Photo</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14 }}>
        {items.map(item => (
          <div key={item.id} style={{ border:'1px solid rgba(0,184,148,0.12)',borderRadius:14,overflow:'hidden',background:'#f7faf9' }}>
            <div style={{ height:140,overflow:'hidden',background:'#e0f0e8' }}>
              <img src={item.image_url} alt={item.title} style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>{e.target.style.display='none';}} />
            </div>
            <div style={{ padding:12 }}>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.88rem',color:'#0d1f1a',marginBottom:2 }}>{item.title}</div>
              <div style={{ fontSize:'0.76rem',color:'#8fa89f',marginBottom:10 }}>{item.event_name}</div>
              <div style={{ display:'flex',gap:6 }}>
                <button onClick={() => openEdit(item)} style={{...editBtn,flex:1,justifyContent:'center',display:'flex',alignItems:'center',gap:4}}><FaEdit/> Edit</button>
                <button onClick={() => del(item.id)} style={{...dangerBtn,display:'flex',alignItems:'center'}}><FaTrash/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Gallery Photo' : 'Edit Photo'} onClose={() => setModal(null)}>
          <FormField label="Photo Title *" value={form.title} onChange={v => setForm(f=>({...f,title:v}))} placeholder="e.g. Opening Keynote"/>
          <FormField label="Image URL *" value={form.image_url} onChange={v => setForm(f=>({...f,image_url:v}))} placeholder="https://images.unsplash.com/..."/>
          <FormField label="Event Name *" value={form.event_name} onChange={v => setForm(f=>({...f,event_name:v}))} placeholder="e.g. AI Innovation Summit 2025"/>
          {form.image_url && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.75rem',color:'#3d5a52',textTransform:'uppercase',letterSpacing:'0.06em' }}>Preview</label>
              <img src={form.image_url} alt="preview" style={{ width:'100%',height:160,objectFit:'cover',borderRadius:10,marginTop:6,border:'1px solid rgba(0,184,148,0.2)' }} onError={e=>e.target.style.display='none'}/>
            </div>
          )}
          <button onClick={save} disabled={loading} style={{...tealBtn,width:'100%',justifyContent:'center',marginTop:8}}>
            {loading ? 'Saving...' : <><FaCheck/> {modal==='add'?'Add Photo':'Save Changes'}</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Manage Articles ──────────────────────────────────────────────────────
function ArticlesTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:'', excerpt:'', content:'', author:'', category:'', image_url:'' });
  const [loading, setLoading] = useState(false);

  const load = () => API.get('/articles').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (item) => {
    API.get(`/articles/${item.id}`).then(r => {
      setForm({ title:r.data.title, excerpt:r.data.excerpt, content:r.data.content, author:r.data.author, category:r.data.category, image_url:r.data.image_url||'' });
      setModal(r.data);
    });
  };
  const openAdd = () => { setForm({ title:'', excerpt:'', content:'', author:'', category:'', image_url:'' }); setModal('add'); };

  const save = async () => {
    if (!form.title||!form.excerpt||!form.content||!form.author||!form.category) { toast.error('Please fill all required fields.'); return; }
    setLoading(true);
    try {
      if (modal === 'add') { await API.post('/articles', form); toast.success('Article published!'); }
      else { await API.put(`/articles/${modal.id}`, form); toast.success('Article updated!'); }
      setModal(null); load();
    } catch (e) { toast.error('Error saving.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await API.delete(`/articles/${id}`); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Error.'); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Manage Articles <span style={{color:'#00b894',fontSize:'0.9rem'}}>({items.length})</span></h3>
        <button onClick={openAdd} style={tealBtn}><FaPlus/> Write Article</button>
      </div>
      <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'0.86rem' }}>
        <thead>
          <tr style={{ borderBottom:'2px solid rgba(0,184,148,0.15)' }}>
            {['Title','Category','Author','Date','Actions'].map(h=>(
              <th key={h} style={{ padding:'10px 12px',textAlign:'left',color:'#8fa89f',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item=>(
            <tr key={item.id} style={{ borderBottom:'1px solid rgba(0,0,0,0.04)' }}
              onMouseEnter={e=>e.currentTarget.style.background='#f7faf9'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <td style={{ padding:'11px 12px',color:'#0d1f1a',fontWeight:600,maxWidth:280 }}>{item.title}</td>
              <td style={{ padding:'11px 12px' }}><span style={{ background:'rgba(0,184,148,0.1)',color:'#00b894',padding:'3px 10px',borderRadius:999,fontSize:'0.72rem',fontFamily:'var(--font-display)',fontWeight:700 }}>{item.category}</span></td>
              <td style={{ padding:'11px 12px',color:'#3d5a52' }}>{item.author}</td>
              <td style={{ padding:'11px 12px',color:'#8fa89f' }}>{new Date(item.created_at).toLocaleDateString('en-GB')}</td>
              <td style={{ padding:'11px 12px' }}>
                <button onClick={()=>openEdit(item)} style={editBtn}><FaEdit/></button>
                <button onClick={()=>del(item.id)} style={dangerBtn}><FaTrash/></button>
              </td>
            </tr>
          ))}
          {!items.length && <tr><td colSpan={5} style={{ padding:32,textAlign:'center',color:'#8fa89f' }}>No articles yet.</td></tr>}
        </tbody>
      </table>
      {modal && (
        <Modal title={modal==='add'?'Write New Article':'Edit Article'} onClose={()=>setModal(null)}>
          <FormField label="Title *" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Article title"/>
          <FormField label="Category *" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} placeholder="e.g. AI Trends, Case Study, Technology"/>
          <FormField label="Author *" value={form.author} onChange={v=>setForm(f=>({...f,author:v}))} placeholder="Author name"/>
          <FormField label="Image URL" value={form.image_url} onChange={v=>setForm(f=>({...f,image_url:v}))} placeholder="https://images.unsplash.com/..."/>
          <FormField label="Excerpt * (short summary)" value={form.excerpt} onChange={v=>setForm(f=>({...f,excerpt:v}))} placeholder="Brief summary shown on articles page..." rows={2}/>
          <FormField label="Full Content *" value={form.content} onChange={v=>setForm(f=>({...f,content:v}))} placeholder="Full article content..." rows={6}/>
          <button onClick={save} disabled={loading} style={{...tealBtn,width:'100%',justifyContent:'center',marginTop:8}}>
            {loading?'Saving...':<><FaCheck/> {modal==='add'?'Publish Article':'Save Changes'}</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Manage Events ────────────────────────────────────────────────────────
function EventsTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', date:'', location:'', type:'upcoming', image_url:'' });
  const [loading, setLoading] = useState(false);

  const load = () => API.get('/events').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (item) => { setForm({ title:item.title, description:item.description, date:item.date, location:item.location, type:item.type, image_url:item.image_url||'' }); setModal(item); };
  const openAdd = () => { setForm({ title:'', description:'', date:'', location:'', type:'upcoming', image_url:'' }); setModal('add'); };

  const save = async () => {
    if (!form.title||!form.description||!form.date||!form.location) { toast.error('Please fill all required fields.'); return; }
    setLoading(true);
    try {
      if (modal==='add') { await API.post('/events', form); toast.success('Event added!'); }
      else { await API.put(`/events/${modal.id}`, form); toast.success('Event updated!'); }
      setModal(null); load();
    } catch (e) { toast.error('Error saving.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await API.delete(`/events/${id}`); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Error.'); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Manage Events <span style={{color:'#00b894',fontSize:'0.9rem'}}>({items.length})</span></h3>
        <button onClick={openAdd} style={tealBtn}><FaPlus/> Add Event</button>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
        {items.map(item=>(
          <div key={item.id} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',background:'#f7faf9',border:'1px solid rgba(0,184,148,0.1)',borderRadius:12 }}>
            <div>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:4 }}>
                <span style={{ background:item.type==='upcoming'?'rgba(0,184,148,0.1)':'rgba(0,0,0,0.06)',color:item.type==='upcoming'?'#00b894':'#8fa89f',padding:'3px 10px',borderRadius:999,fontSize:'0.72rem',fontFamily:'var(--font-display)',fontWeight:700 }}>{item.type}</span>
                <h4 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a',margin:0 }}>{item.title}</h4>
              </div>
              <div style={{ color:'#8fa89f',fontSize:'0.82rem' }}>{item.date} · {item.location}</div>
            </div>
            <div style={{ display:'flex',gap:6,flexShrink:0 }}>
              <button onClick={()=>openEdit(item)} style={editBtn}><FaEdit/></button>
              <button onClick={()=>del(item.id)} style={dangerBtn}><FaTrash/></button>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color:'#8fa89f',textAlign:'center',padding:32 }}>No events yet.</p>}
      </div>
      {modal && (
        <Modal title={modal==='add'?'Add New Event':'Edit Event'} onClose={()=>setModal(null)}>
          <FormField label="Event Title *" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. AI Innovation Summit 2025"/>
          <FormField label="Date *" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} placeholder="e.g. 2025-09-15" type="date"/>
          <FormField label="Location *" value={form.location} onChange={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. ExCeL London"/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.75rem',color:'#3d5a52',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em' }}>Type *</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{...inputStyle,marginBottom:0}}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <FormField label="Image URL" value={form.image_url} onChange={v=>setForm(f=>({...f,image_url:v}))} placeholder="https://images.unsplash.com/..."/>
          <FormField label="Description *" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="Describe the event..." rows={3}/>
          <button onClick={save} disabled={loading} style={{...tealBtn,width:'100%',justifyContent:'center',marginTop:8}}>
            {loading?'Saving...':<><FaCheck/> {modal==='add'?'Add Event':'Save Changes'}</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Manage Testimonials ─────────────────────────────────────────────────
function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ client_name:'', company:'', position:'', message:'', rating:5 });
  const [loading, setLoading] = useState(false);

  const load = () => API.get('/testimonials').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openEdit = (item) => { setForm({ client_name:item.client_name, company:item.company, position:item.position, message:item.message, rating:item.rating }); setModal(item); };
  const openAdd = () => { setForm({ client_name:'', company:'', position:'', message:'', rating:5 }); setModal('add'); };

  const save = async () => {
    if (!form.client_name||!form.company||!form.position||!form.message) { toast.error('All fields required.'); return; }
    setLoading(true);
    try {
      if (modal==='add') { await API.post('/testimonials', form); toast.success('Testimonial added!'); }
      else { await API.put(`/testimonials/${modal.id}`, form); toast.success('Updated!'); }
      setModal(null); load();
    } catch (e) { toast.error('Error saving.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try { await API.delete(`/testimonials/${id}`); toast.success('Deleted.'); load(); }
    catch (e) { toast.error('Error.'); }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Manage Testimonials <span style={{color:'#00b894',fontSize:'0.9rem'}}>({items.length})</span></h3>
        <button onClick={openAdd} style={tealBtn}><FaPlus/> Add Testimonial</button>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16 }}>
        {items.map(item=>(
          <div key={item.id} style={{ background:'#f7faf9',border:'1px solid rgba(0,184,148,0.12)',borderRadius:14,padding:18 }}>
            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
              <div style={{ color:'#f59e0b',fontSize:'0.9rem' }}>{'★'.repeat(item.rating)}</div>
              <div>
                <button onClick={()=>openEdit(item)} style={editBtn}><FaEdit/></button>
                <button onClick={()=>del(item.id)} style={dangerBtn}><FaTrash/></button>
              </div>
            </div>
            <p style={{ color:'#3d5a52',fontSize:'0.86rem',lineHeight:1.65,marginBottom:12,fontStyle:'italic' }}>"{item.message.substring(0,100)}..."</p>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.88rem',color:'#0d1f1a' }}>{item.client_name}</div>
            <div style={{ color:'#8fa89f',fontSize:'0.78rem' }}>{item.position}, {item.company}</div>
          </div>
        ))}
        {!items.length && <p style={{ color:'#8fa89f',textAlign:'center',padding:32 }}>No testimonials yet.</p>}
      </div>
      {modal && (
        <Modal title={modal==='add'?'Add Testimonial':'Edit Testimonial'} onClose={()=>setModal(null)}>
          <FormField label="Client Name *" value={form.client_name} onChange={v=>setForm(f=>({...f,client_name:v}))} placeholder="e.g. Jane Smith"/>
          <FormField label="Company *" value={form.company} onChange={v=>setForm(f=>({...f,company:v}))} placeholder="e.g. TechCorp UK"/>
          <FormField label="Position *" value={form.position} onChange={v=>setForm(f=>({...f,position:v}))} placeholder="e.g. Chief Operations Officer"/>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.75rem',color:'#3d5a52',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em' }}>Rating (1–5) *</label>
            <div style={{ display:'flex',gap:8 }}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setForm(f=>({...f,rating:n}))} style={{ width:36,height:36,borderRadius:8,border:'none',cursor:'pointer',background:form.rating>=n?'#f59e0b':'#eeeeee',color:form.rating>=n?'#fff':'#aaaaaa',fontSize:16,transition:'all 0.15s' }}>★</button>
              ))}
            </div>
          </div>
          <FormField label="Testimonial Message *" value={form.message} onChange={v=>setForm(f=>({...f,message:v}))} placeholder="Client's testimonial text..." rows={4}/>
          <button onClick={save} disabled={loading} style={{...tealBtn,width:'100%',justifyContent:'center',marginTop:8}}>
            {loading?'Saving...':<><FaCheck/> {modal==='add'?'Add Testimonial':'Save Changes'}</>}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = () => {
    setLoading(true);
    API.get('/inquiries').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); toast.info('Logged out.'); navigate('/admin/login'); };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/${type}/${id}`);
      toast.success('Deleted successfully.');
      if (type === 'inquiries') fetchData();
    } catch { toast.error('Failed to delete.'); }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: FaChartBar },
    { id: 'inquiries', label: '📬 Enquiries', icon: FaEnvelope },
    { id: 'analytics', label: '📈 Analytics', icon: FaGlobe },
    { id: 'solutions', label: '🛠 Services', icon: FaTools },
    { id: 'gallery', label: '🖼 Gallery', icon: FaImages },
    { id: 'articles', label: '📰 Articles', icon: FaNewspaper },
    { id: 'events', label: '📅 Events', icon: FaCalendarAlt },
    { id: 'testimonials', label: '⭐ Testimonials', icon: FaStar },
  ];

  const StatCard = ({ value, label, color }) => (
    <div style={{ textAlign:'center',padding:'28px 20px',background:'#fff',border:`1px solid ${color}22`,borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}>
      <div style={{ fontFamily:'var(--font-display)',fontSize:'2.2rem',fontWeight:900,color:'#0d1f1a',marginBottom:4 }}>{value}</div>
      <div style={{ color:'#8fa89f',fontSize:'0.88rem' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh',background:'#f7faf9' }}>
      {/* Top Nav */}
      <nav style={{ background:'#0d1f1a',padding:'0 24px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:30,height:30,borderRadius:'50%',border:'2px solid #00b894',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#00b894',fontWeight:900,fontFamily:'var(--font-display)' }}>AI</div>
          <span style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#fff' }}>AI-Solutions <span style={{color:'#00b894'}}>Admin</span></span>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:14 }}>
          <span style={{ color:'rgba(255,255,255,0.5)',fontSize:'0.84rem' }}>Welcome, <strong style={{color:'rgba(255,255,255,0.8)'}}>{admin?.username}</strong></span>
          <Link to="/" style={{ padding:'6px 16px',borderRadius:999,border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.7)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.82rem',textDecoration:'none' }}>View Site</Link>
          <button onClick={handleLogout} style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 16px',borderRadius:999,border:'1px solid rgba(0,184,148,0.4)',background:'transparent',color:'#00b894',cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.82rem' }}>
            <FaSignOutAlt/> Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1300,margin:'0 auto',padding:'32px 24px' }}>
        {/* Page title */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'var(--font-display)',fontWeight:900,fontSize:'1.8rem',color:'#0d1f1a',marginBottom:4 }}>Admin Dashboard</h1>
          <p style={{ color:'#8fa89f',fontSize:'0.9rem' }}>Manage all content across your website from one place</p>
        </div>

        {/* Tab navigation */}
        <div style={{ display:'flex',gap:6,marginBottom:28,flexWrap:'wrap',background:'#fff',padding:8,borderRadius:16,border:'1px solid rgba(0,184,148,0.1)',boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:'9px 18px',borderRadius:10,cursor:'pointer',
              fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.84rem',
              background:activeTab===tab.id?'#00b894':'transparent',
              border:'none',
              color:activeTab===tab.id?'#fff':'#3d5a52',
              transition:'all 0.2s',
            }}>{tab.label}</button>
          ))}
        </div>

        {loading && activeTab==='overview' ? <div className="spinner"/> : (
          <>
            {/* OVERVIEW */}
            {activeTab==='overview' && (
              <div>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24 }}>
                  <StatCard value={data?.stats?.total||0} label="Total Enquiries" color="#00b894"/>
                  <StatCard value={Object.keys(data?.stats?.byCountry||{}).length} label="Countries" color="#059669"/>
                  <StatCard value={Object.keys(data?.stats?.byCompany||{}).length} label="Companies" color="#f59e0b"/>
                  <StatCard value={data?.inquiries?.filter(i=>{const d=new Date(i.created_at);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length||0} label="This Month" color="#2563eb"/>
                </div>
                <div style={cardStyle}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
                    <h3 style={{ fontFamily:'var(--font-display)',fontWeight:700,color:'#0d1f1a' }}>Recent Enquiries</h3>
                    <button onClick={()=>setActiveTab('inquiries')} style={{ background:'#f7faf9',border:'1px solid rgba(0,184,148,0.2)',borderRadius:999,padding:'6px 14px',color:'#00b894',cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.82rem' }}>View All</button>
                  </div>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'0.86rem' }}>
                      <thead>
                        <tr style={{ borderBottom:'2px solid rgba(0,184,148,0.15)' }}>
                          {['Name','Company','Country','Date','Actions'].map(h=>(
                            <th key={h} style={{ padding:'10px 12px',textAlign:'left',color:'#8fa89f',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(data?.inquiries||[]).slice(0,5).map(inq=>(
                          <tr key={inq.id} style={{ borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                            <td style={{ padding:'11px 12px',color:'#0d1f1a',fontWeight:600 }}>{inq.name}</td>
                            <td style={{ padding:'11px 12px',color:'#3d5a52' }}>{inq.company_name}</td>
                            <td style={{ padding:'11px 12px',color:'#3d5a52' }}>{inq.country}</td>
                            <td style={{ padding:'11px 12px',color:'#8fa89f' }}>{new Date(inq.created_at).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding:'11px 12px' }}><button onClick={()=>handleDelete('inquiries',inq.id)} style={dangerBtn}><FaTrash/></button></td>
                          </tr>
                        ))}
                        {!data?.inquiries?.length && <tr><td colSpan={5} style={{ padding:32,textAlign:'center',color:'#8fa89f' }}>No enquiries yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Quick links */}
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14 }}>
                  {[['🛠 Services',()=>setActiveTab('solutions')],['🖼 Gallery',()=>setActiveTab('gallery')],['📰 Articles',()=>setActiveTab('articles')],['📅 Events',()=>setActiveTab('events')],['⭐ Testimonials',()=>setActiveTab('testimonials')]].map(([label,fn])=>(
                    <button key={label} onClick={fn} style={{ padding:'16px',background:'#fff',border:'1px solid rgba(0,184,148,0.15)',borderRadius:14,cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'0.9rem',color:'#0d1f1a',textAlign:'left',transition:'all 0.2s' }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#00b894';e.currentTarget.style.transform='translateY(-2px)';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,184,148,0.15)';e.currentTarget.style.transform='translateY(0)';}}
                    >{label}</button>
                  ))}
                </div>
              </div>
            )}

            {activeTab==='inquiries' && <EnquiriesTab data={data} onDelete={handleDelete}/>}
            {activeTab==='analytics' && <AnalyticsTab data={data}/>}
            {activeTab==='solutions' && <SolutionsTab/>}
            {activeTab==='gallery' && <GalleryTab/>}
            {activeTab==='articles' && <ArticlesTab/>}
            {activeTab==='events' && <EventsTab/>}
            {activeTab==='testimonials' && <TestimonialsTab/>}
          </>
        )}
      </div>
    </div>
  );
}
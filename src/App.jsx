import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LightningAddress } from '@getalby/lightning-tools';

// ── Views: 'landing' | 'form' | 'card' ──────────────────────────────────────

export default function App() {
  const [view, setView] = useState('landing');
  const [cardData, setCardData] = useState(null);

  if (view === 'landing') return <Landing onStart={() => setView('form')} />;
  if (view === 'form') return <CardForm onDone={(data) => { setCardData(data); setView('card'); }} onBack={() => setView('landing')} />;
  if (view === 'card') return <CardView data={cardData} onEdit={() => setView('form')} />;
}

// ── Shared tokens ─────────────────────────────────────────────────────────────

const GREEN = '#00ff9d';
const BG = 'linear-gradient(160deg, #0a0f1a 0%, #0d1f2d 50%, #0a0f1a 100%)';

// ── Landing ──────────────────────────────────────────────────────────────────

function Landing({ onStart }) {
  const features = [
    { icon: '⚡', title: 'Lightning Address', desc: 'Recibí pagos al instante con tu dirección Lightning' },
    { icon: '🪪', title: 'Tarjeta digital', desc: 'Tu identidad Bitcoin en un solo link compartible' },
    { icon: '🔗', title: 'Links & redes', desc: 'GitHub, Nostr, X — todo en un lugar' },
    { icon: '📲', title: 'QR listo', desc: 'Cualquiera te puede pagar escaneando el QR' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* Neon grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(247,147,26,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <span style={{
            padding: '6px 18px', borderRadius: '20px',
            background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.25)',
            fontSize: '0.8rem', color: GREEN, letterSpacing: '1px', fontWeight: '600', textTransform: 'uppercase',
          }}>
            Lightning Hackathon 2026 · La Crypta
          </span>
        </div>

        {/* Hero heading */}
        <h1 style={{
          textAlign: 'center', fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: '800', letterSpacing: '-1.5px', lineHeight: '1.1', margin: '0 0 24px',
        }}>
          Tu tarjeta de presentación{' '}
          <span style={{ color: '#f7931a', textShadow: '0 0 30px rgba(247,147,26,0.5)' }}>Bitcoin</span>
        </h1>

        <p style={{
          textAlign: 'center', fontSize: '1.15rem', color: 'rgba(255,255,255,0.55)',
          maxWidth: '580px', margin: '0 auto 48px', lineHeight: '1.7',
        }}>
          Creá tu propia tarjeta digital con tu Lightning Address, links y bio.
          Compartila, recibí pagos al instante, y representá tu identidad en la red de Bitcoin.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '80px' }}>
          <button
            onClick={onStart}
            style={{
              padding: '18px 48px',
              background: `linear-gradient(135deg, ${GREEN} 0%, #00cc7d 100%)`,
              color: '#000', fontWeight: '800', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontSize: '1.1rem', letterSpacing: '0.3px',
              boxShadow: `0 8px 40px rgba(0,255,157,0.3)`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 12px 50px rgba(0,255,157,0.45)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,255,157,0.3)`; }}
          >
            ⚡ Crea tu primera tarjeta
          </button>
        </div>

        {/* Features grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '80px',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '24px 20px',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,157,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontWeight: '700', marginBottom: '6px', fontSize: '0.95rem' }}>{f.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: '1.5' }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Preview mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: '380px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px', padding: '32px 28px',
            boxShadow: `0 0 80px rgba(0,255,157,0.06)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            {/* mock avatar */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ff9d, #0077ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', fontWeight: '700', color: '#000',
              boxShadow: `0 0 24px rgba(0,255,157,0.25)`,
            }}>S</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.3rem' }}>satoshi</div>
              <div style={{ color: GREEN, fontSize: '0.82rem', fontFamily: 'monospace', marginTop: '4px' }}>⚡ satoshi@bitcoin.org</div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center', lineHeight: '1.5' }}>
              Building a peer-to-peer electronic cash system.
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['GitHub', 'Nostr', 'X'].map(l => (
                <span key={l} style={{
                  padding: '6px 14px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                  fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)',
                }}>{l}</span>
              ))}
            </div>
            <div style={{
              width: '100%', height: '1px', background: 'rgba(255,255,255,0.07)',
            }} />
            <div style={{
              width: '100%', padding: '12px', textAlign: 'center',
              background: `linear-gradient(135deg, ${GREEN}, #00cc7d)`,
              borderRadius: '12px', color: '#000', fontWeight: '700', fontSize: '0.9rem',
            }}>⚡ Enviarme sats</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
              Hecho con ⚡ en Lightning Hackathon 2026
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Card Form ─────────────────────────────────────────────────────────────────

function CardForm({ onDone, onBack }) {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const [form, setForm] = useState({
    name: '',
    lnAddress: '',
    bio: '',
    github: '',
    nostr: '',
    twitter: '',
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: identity, 2: links

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUrl(URL.createObjectURL(file));
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validateStep1() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio';
    if (!form.lnAddress.trim()) errs.lnAddress = 'La Lightning Address es obligatoria';
    else if (!form.lnAddress.includes('@')) errs.lnAddress = 'Formato: usuario@dominio.com';
    return errs;
  }

  function handleNext() {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  }

  function handleSubmit() {
    onDone({ ...form, avatarUrl });
  }

  const inputStyle = (err) => ({
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${err ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '12px', color: '#fff', fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'system-ui, sans-serif',
  });

  const labelStyle = {
    display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>

      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '500px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '24px', padding: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Volver
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: '700',
                background: step >= s ? GREEN : 'rgba(255,255,255,0.08)',
                color: step >= s ? '#000' : 'rgba(255,255,255,0.3)',
                boxShadow: step >= s ? `0 0 14px rgba(0,255,157,0.4)` : 'none',
                transition: 'all 0.3s',
              }}>{s}</div>
              {s < 2 && <div style={{ flex: 1, height: '1px', background: step > s ? GREEN : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />}
            </React.Fragment>
          ))}
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginLeft: '8px' }}>
            {step === 1 ? 'Identidad' : 'Links'}
          </span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '36px 32px',
          boxShadow: `0 0 60px rgba(0,255,157,0.04)`,
        }}>

          {step === 1 && (
            <>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: '700' }}>Tu identidad</h2>
              <p style={{ margin: '0 0 32px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                Esta info aparecerá en tu tarjeta pública.
              </p>

              {/* Avatar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: '88px', height: '88px', borderRadius: '50%', cursor: 'pointer',
                      background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #00ff9d, #0077ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.8rem', fontWeight: '700', color: '#000',
                      boxShadow: `0 0 24px rgba(0,255,157,0.2)`,
                      border: `2px dashed ${avatarUrl ? 'transparent' : 'rgba(0,255,157,0.3)'}`,
                      overflow: 'hidden',
                    }}
                  >
                    {avatarUrl
                      ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '+'
                    }
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  <span style={{ display: 'block', textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>Foto (opcional)</span>
                </div>
              </div>

              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Nombre / alias</label>
                <input
                  style={inputStyle(errors.name)}
                  placeholder="satoshi"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}
                />
                {errors.name && <span style={{ fontSize: '0.78rem', color: '#ff6b6b', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
              </div>

              {/* Lightning Address */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Lightning Address ⚡</label>
                <input
                  style={inputStyle(errors.lnAddress)}
                  placeholder="vos@getalby.com"
                  value={form.lnAddress}
                  onChange={e => set('lnAddress', e.target.value)}
                  onFocus={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = errors.lnAddress ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}
                />
                {errors.lnAddress
                  ? <span style={{ fontSize: '0.78rem', color: '#ff6b6b', marginTop: '4px', display: 'block' }}>{errors.lnAddress}</span>
                  : <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', display: 'block' }}>Podés obtener una gratis en getalby.com</span>
                }
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Bio <span style={{ color: 'rgba(255,255,255,0.25)' }}>(opcional)</span></label>
                <textarea
                  style={{ ...inputStyle(false), resize: 'none', height: '80px', lineHeight: '1.5' }}
                  placeholder="Building on Lightning Network..."
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  onFocus={e => e.target.style.borderColor = GREEN}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>

              <button
                onClick={handleNext}
                style={{
                  width: '100%', padding: '15px',
                  background: `linear-gradient(135deg, ${GREEN}, #00cc7d)`,
                  color: '#000', fontWeight: '700', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', fontSize: '1rem',
                }}
              >
                Siguiente →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: '700' }}>Tus links</h2>
              <p style={{ margin: '0 0 28px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                Todo es opcional. Solo agrega lo que uses.
              </p>

              {[
                { field: 'github', label: 'GitHub', placeholder: 'https://github.com/usuario', icon: '💻' },
                { field: 'nostr', label: 'Nostr', placeholder: 'https://primal.net/usuario', icon: '🟣' },
                { field: 'twitter', label: 'X / Twitter', placeholder: 'https://x.com/usuario', icon: '🐦' },
              ].map(({ field, label, placeholder, icon }) => (
                <div key={field} style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>{icon} {label}</label>
                  <input
                    style={inputStyle(false)}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    onFocus={e => e.target.style.borderColor = GREEN}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              ))}

              <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: '0 0 auto', padding: '15px 20px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem',
                  }}
                >
                  ←
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1, padding: '15px',
                    background: `linear-gradient(135deg, ${GREEN}, #00cc7d)`,
                    color: '#000', fontWeight: '700', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', fontSize: '1rem',
                  }}
                >
                  Ver mi tarjeta ✨
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Card View ─────────────────────────────────────────────────────────────────

function CardView({ data, onEdit }) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSats, setSelectedSats] = useState(21);
  const [customSats, setCustomSats] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [copied, setCopied] = useState(false);

  const PRESETS = [21, 100, 500, 1000];
  const satsAmount = customSats ? parseInt(customSats) : selectedSats;

  const links = [
    data.github && { label: 'GitHub', url: data.github, icon: '💻' },
    data.nostr && { label: 'Nostr', url: data.nostr, icon: '🟣' },
    data.twitter && { label: 'X', url: data.twitter, icon: '🐦' },
  ].filter(Boolean);

  const initials = data.name ? data.name.charAt(0).toUpperCase() : '?';

  async function generateInvoice() {
    if (!satsAmount || satsAmount < 1) { setStatus({ msg: 'Ingresa una cantidad valida', type: 'error' }); return; }
    setLoading(true);
    setStatus({ msg: 'Generando invoice...', type: 'info' });
    setInvoice(null);
    try {
      const ln = new LightningAddress(data.lnAddress);
      await ln.fetch();
      const inv = await ln.requestInvoice({ satoshi: satsAmount });
      setInvoice(inv.paymentRequest);
      setStatus({ msg: '', type: '' });
    } catch (err) {
      setStatus({ msg: 'Error: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function payWithWebLN() {
    if (!invoice) return;
    try {
      setStatus({ msg: 'Abriendo wallet...', type: 'info' });
      if (!window.webln) throw new Error('No se detectó wallet WebLN. Instalá Alby.');
      await window.webln.enable();
      await window.webln.sendPayment(invoice);
      setStatus({ msg: 'Pago enviado! Gracias!', type: 'success' });
      setInvoice(null);
      setTimeout(() => { setShowPayment(false); setStatus({ msg: '', type: '' }); }, 2500);
    } catch (err) {
      setStatus({ msg: err.message, type: 'error' });
    }
  }

  function copyInvoice() {
    navigator.clipboard.writeText(invoice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setShowPayment(false);
    setInvoice(null);
    setStatus({ msg: '', type: '' });
    setCustomSats('');
    setSelectedSats(21);
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>

      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Edit button */}
      <button
        onClick={onEdit}
        style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 10,
          padding: '8px 16px', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
          color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem',
        }}
      >
        Editar tarjeta
      </button>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px', padding: '40px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
        boxShadow: `0 0 60px rgba(0,255,157,0.06)`,
      }}>

        {/* Avatar */}
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00ff9d, #0077ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.2rem', fontWeight: '700', color: '#000',
          boxShadow: `0 0 30px rgba(0,255,157,0.3)`,
          overflow: 'hidden',
        }}>
          {data.avatarUrl
            ? <img src={data.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials
          }
        </div>

        {/* Name + LN Address */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.5px', margin: '0' }}>{data.name}</h1>
          <span style={{ fontSize: '0.9rem', color: GREEN, opacity: 0.85, fontFamily: 'monospace' }}>⚡ {data.lnAddress}</span>
        </div>

        {/* Bio */}
        {data.bio && (
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: '1.6', margin: '0 4px' }}>
            {data.bio}
          </p>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {links.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                padding: '8px 16px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                color: '#fff', textDecoration: 'none', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        )}

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.07)' }} />

        {/* Payment section */}
        {!showPayment ? (
          <button
            style={{
              width: '100%', padding: '16px',
              background: `linear-gradient(135deg, ${GREEN} 0%, #00cc7d 100%)`,
              color: '#000', fontWeight: '700', border: 'none', borderRadius: '14px',
              cursor: 'pointer', fontSize: '1rem',
              boxShadow: `0 4px 20px rgba(0,255,157,0.2)`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onClick={() => setShowPayment(true)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 6px 28px rgba(0,255,157,0.35)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,255,157,0.2)`; }}
          >
            ⚡ Enviarme sats
          </button>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!invoice && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {PRESETS.map(s => (
                    <button key={s}
                      style={{
                        padding: '10px 0',
                        background: (!customSats && selectedSats === s) ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${(!customSats && selectedSats === s) ? GREEN : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '10px',
                        color: (!customSats && selectedSats === s) ? GREEN : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer', fontSize: '0.85rem',
                        fontWeight: (!customSats && selectedSats === s) ? '600' : '400',
                      }}
                      onClick={() => { setSelectedSats(s); setCustomSats(''); }}
                    >{s}</button>
                  ))}
                </div>

                <input
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  type="number"
                  placeholder="Otro monto en sats..."
                  value={customSats}
                  onChange={e => setCustomSats(e.target.value)}
                />

                <button
                  style={{
                    width: '100%', padding: '16px',
                    background: `linear-gradient(135deg, ${GREEN}, #00cc7d)`,
                    color: '#000', fontWeight: '700', border: 'none', borderRadius: '14px',
                    cursor: 'pointer', fontSize: '1rem', opacity: loading ? 0.6 : 1,
                  }}
                  onClick={generateInvoice}
                  disabled={loading}
                >
                  {loading ? 'Generando...' : `Generar invoice por ${satsAmount} sats`}
                </button>
              </>
            )}

            {invoice && (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,157,0.2)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <QRCodeSVG value={invoice} size={200} bgColor="transparent" fgColor="#ffffff" level="M" />
                <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', wordBreak: 'break-all', textAlign: 'center', maxHeight: '60px', overflow: 'hidden', margin: 0 }}>{invoice}</p>
                <button style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }} onClick={copyInvoice}>
                  {copied ? 'Copiado!' : 'Copiar invoice'}
                </button>
                <button style={{ width: '100%', padding: '14px', background: '#f7931a', color: '#000', fontWeight: '700', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem' }} onClick={payWithWebLN}>
                  Pagar con wallet (WebLN)
                </button>
              </div>
            )}

            {status.msg && (
              <p style={{ fontSize: '0.85rem', color: status.type === 'success' ? GREEN : status.type === 'error' ? '#ff6b6b' : 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>{status.msg}</p>
            )}

            <button onClick={reset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'center' }}>
              Cancelar
            </button>
          </div>
        )}

        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', margin: 0 }}>
          Hecho con ⚡ para Lightning Hackathon 2026 · La Crypta
        </p>

      </div>
    </div>
  );
}

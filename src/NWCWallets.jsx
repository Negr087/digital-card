import React, { useState, useEffect } from 'react';

const ORANGE = '#f7931a';

// ── Storage helpers ────────────────────────────────────────────────────────────

/** Lee la URL de NWC. Migra automáticamente desde nwcWallets si existe. */
export function getNWCUrl() {
  try {
    const url = localStorage.getItem('nwcUrl');
    if (url) return url;
    // Migrar desde formato multi-wallet si existe
    const raw = localStorage.getItem('nwcWallets');
    if (raw) {
      const wallets = JSON.parse(raw);
      if (wallets.length > 0) {
        const defaultId = localStorage.getItem('nwcDefaultId');
        const wallet = wallets.find(w => w.id === defaultId) || wallets[0];
        localStorage.setItem('nwcUrl', wallet.url);
        localStorage.removeItem('nwcWallets');
        localStorage.removeItem('nwcDefaultId');
        return wallet.url;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveNWCUrl(url) {
  if (url) {
    localStorage.setItem('nwcUrl', url);
  } else {
    localStorage.removeItem('nwcUrl');
  }
}

// ── NWCWalletManager ──────────────────────────────────────────────────────────

export function NWCWalletManager() {
  const [url, setUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUrl(getNWCUrl() || '');
  }, []);

  function save() {
    setError('');
    if (draft && !draft.trim().startsWith('nostr+walletconnect://')) {
      setError('La URL debe empezar con nostr+walletconnect://');
      return;
    }
    saveNWCUrl(draft.trim() || null);
    setUrl(draft.trim());
    setEditing(false);
  }

  function remove() {
    saveNWCUrl(null);
    setUrl('');
    setDraft('');
    setEditing(false);
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ marginTop: '8px', marginBottom: '8px', padding: '16px', background: 'rgba(247,147,26,0.05)', border: '1px solid rgba(247,147,26,0.15)', borderRadius: '12px' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: '700', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
        ⚡ NWC — Nostr Wallet Connect
      </label>

      {!editing ? (
        <>
          {url ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.35)', borderRadius: '10px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {url.slice(0, 55)}…
                </div>
              </div>
              <button
                onClick={() => { setDraft(url); setEditing(true); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, fontSize: '0.8rem', padding: '0', flexShrink: 0 }}
              >
                Editar
              </button>
              <button
                onClick={remove}
                title="Eliminar"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.6)', fontSize: '1rem', padding: '0', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setDraft(''); setEditing(true); }}
              style={{ padding: '5px 12px', background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.3)', borderRadius: '8px', color: ORANGE, cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
            >
              + Agregar
            </button>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            style={inputStyle}
            placeholder="nostr+walletconnect://..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            autoFocus
          />
          {error && <span style={{ fontSize: '0.78rem', color: '#ff6b6b' }}>{error}</span>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setEditing(false); setError(''); }}
              style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Cancelar
            </button>
            <button
              onClick={save}
              style={{ flex: 2, padding: '10px', background: ORANGE, border: 'none', borderRadius: '8px', color: '#000', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { describe, it, expect, beforeEach } from 'vitest';
import { getNWCUrl, saveNWCUrl } from './NWCWallets.jsx';

// Vitest provee un localStorage mock en el entorno jsdom
beforeEach(() => {
  localStorage.clear();
});

describe('getNWCUrl / saveNWCUrl', () => {
  it('devuelve null cuando no hay URL guardada', () => {
    expect(getNWCUrl()).toBeNull();
  });

  it('guarda y lee la URL correctamente', () => {
    const url = 'nostr+walletconnect://relay?secret=abc';
    saveNWCUrl(url);
    expect(getNWCUrl()).toBe(url);
  });

  it('elimina la URL cuando se pasa null', () => {
    saveNWCUrl('nostr+walletconnect://relay?secret=abc');
    saveNWCUrl(null);
    expect(getNWCUrl()).toBeNull();
  });

  it('migra automáticamente desde formato nwcWallets (multi-wallet legacy)', () => {
    const wallets = [
      { id: 'id-1', name: 'Alby', url: 'nostr+walletconnect://relay?secret=legacy' },
      { id: 'id-2', name: 'Phoenix', url: 'nostr+walletconnect://relay?secret=other' },
    ];
    localStorage.setItem('nwcWallets', JSON.stringify(wallets));
    localStorage.setItem('nwcDefaultId', 'id-2');

    const url = getNWCUrl();
    expect(url).toBe('nostr+walletconnect://relay?secret=other');
    // Debe limpiar el formato viejo
    expect(localStorage.getItem('nwcWallets')).toBeNull();
    expect(localStorage.getItem('nwcDefaultId')).toBeNull();
  });
});

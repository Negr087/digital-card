import { describe, it, expect, beforeEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Lightning Address simulada: el test controla si la invoice trae URL de verify.
const mockInvoice = { verify: null };
vi.mock('@getalby/lightning-tools', () => ({
  LightningAddress: class {
    constructor(address) { this.address = address; this.lnurlpData = { commentAllowed: 0 }; }
    async fetch() {}
    async requestInvoice() { return { paymentRequest: 'lnbc210n1testinvoice', verify: mockInvoice.verify }; }
  },
}));

const findButton = (container, text) =>
  [...container.querySelectorAll('button')].find(b => b.textContent.includes(text));

async function openInvoice(container) {
  await act(async () => { findButton(container, 'Enviarme sats').click(); });
  await act(async () => { findButton(container, 'Generar invoice').click(); });
}

const SAVED_CARD = { name: 'satoshi', lnAddress: 'satoshi@getalby.com', extraLinks: [] };

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function render() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => { root.render(<App />); });
  return { container, root };
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  // Sin red en los tests: cualquier fetch falla controladamente
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));
});

describe('App (smoke)', () => {
  it('renderiza la landing sin tarjeta guardada', async () => {
    const { container, root } = await render();
    expect(container.textContent).toContain('Tu tarjeta de presentación');
    act(() => root.unmount());
  });

  it('renderiza la tarjeta guardada y abre el panel de pago', async () => {
    localStorage.setItem('cardData', JSON.stringify({
      name: 'satoshi', lnAddress: 'satoshi@getalby.com', bio: 'hola',
      github: 'https://github.com/', nostr: 'https://primal.net/', twitter: 'https://x.com/satoshi',
      extraLinks: [{ label: 'discord', url: 'https://discord.gg/' }],
      nip05: 'satoshi@getalby.com',
    }));
    const { container, root } = await render();
    expect(container.textContent).toContain('satoshi@getalby.com');
    // Links con URL base vacía no se muestran; X con usuario sí
    const hrefs = [...container.querySelectorAll('a')].map(a => a.getAttribute('href'));
    expect(hrefs).toContain('https://x.com/satoshi');
    expect(hrefs).not.toContain('https://discord.gg/');
    // NIP-05 sin npub → sin tilde de verificado
    expect(container.querySelector('[title="NIP-05 no verificado"]')).not.toBeNull();

    const payBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Enviarme sats'));
    await act(async () => { payBtn.click(); });
    expect(container.textContent).toContain('Generar invoice por 21 sats');
    act(() => root.unmount());
  });

  it('"Ya pagué" sin verify URL NO dice "Pago recibido"', async () => {
    mockInvoice.verify = null;
    localStorage.setItem('cardData', JSON.stringify(SAVED_CARD));
    const { container, root } = await render();
    await openInvoice(container);
    expect(container.textContent).toContain('lnbc210n1testinvoice');

    await act(async () => { findButton(container, 'Ya pagué').click(); });
    expect(container.textContent).toContain('no permite verificar');
    expect(container.textContent).not.toContain('Pago recibido');
    act(() => root.unmount());
  });

  it('"Ya pagué" con verify URL no confirma si la invoice no está pagada', async () => {
    mockInvoice.verify = 'https://example.com/verify/abc';
    vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => ({ settled: false }) })));
    localStorage.setItem('cardData', JSON.stringify(SAVED_CARD));
    const { container, root } = await render();
    await openInvoice(container);

    await act(async () => { findButton(container, 'Ya pagué').click(); });
    expect(container.textContent).toContain('No detectamos el pago');
    expect(container.textContent).not.toContain('Pago recibido');
    act(() => root.unmount());
  });
});

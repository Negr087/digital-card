import { describe, it, expect } from 'vitest';
import { getStorageKey } from './storage.js';

describe('getStorageKey', () => {
  it('devuelve npub cuando está presente', () => {
    const card = { npub: 'npub1abc123', lnAddress: 'user@domain.com' };
    expect(getStorageKey(card)).toBe('npub1abc123');
  });

  it('devuelve lnAddress en minúsculas cuando no hay npub', () => {
    const card = { lnAddress: 'User@Domain.com' };
    expect(getStorageKey(card)).toBe('user@domain.com');
  });

  it('devuelve lightningAddress en minúsculas como fallback', () => {
    const card = { lightningAddress: 'Someone@Alby.com' };
    expect(getStorageKey(card)).toBe('someone@alby.com');
  });

  it('devuelve null cuando no hay ninguna clave', () => {
    expect(getStorageKey({})).toBeNull();
    expect(getStorageKey(null)).toBeNull();
    expect(getStorageKey(undefined)).toBeNull();
  });

  it('prioriza npub sobre lnAddress', () => {
    const card = { npub: 'npub1xyz', lnAddress: 'x@y.com', lightningAddress: 'a@b.com' };
    expect(getStorageKey(card)).toBe('npub1xyz');
  });
});

import { isCardConsistent } from './storage.js';

describe('isCardConsistent', () => {
  it('acepta una tarjeta cuya lnAddress coincide con la clave', () => {
    expect(isCardConsistent('user@domain.com', { lnAddress: 'User@Domain.com' })).toBe(true);
  });

  it('rechaza una tarjeta con lnAddress distinta (intento de desviar pagos)', () => {
    expect(isCardConsistent('victima@blink.sv', { lnAddress: 'atacante@evil.com' })).toBe(false);
  });

  it('acepta una tarjeta cuyo npub coincide con la clave', () => {
    expect(isCardConsistent('npub1abc', { npub: 'npub1abc', lnAddress: 'x@y.com' })).toBe(true);
  });

  it('rechaza una fila con npub ajeno bajo una clave de lightning address', () => {
    expect(isCardConsistent('victima@blink.sv', { npub: 'npub1otro', lnAddress: 'victima@blink.sv' })).toBe(false);
  });

  it('rechaza datos vacíos o inválidos', () => {
    expect(isCardConsistent('a@b.com', null)).toBe(false);
    expect(isCardConsistent(null, { lnAddress: 'a@b.com' })).toBe(false);
    expect(isCardConsistent('a@b.com', 'texto')).toBe(false);
  });
});

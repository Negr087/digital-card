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

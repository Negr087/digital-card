const SUPABASE_URL = 'https://natgzxjzfhwkttoagqcu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdGd6eGp6Zmh3a3R0b2FncWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDIxNTQsImV4cCI6MjA4ODU3ODE1NH0.3VCWhRzR2n1Q6e2vV1jICKhgapRkmErgTuIsDEWbuYE';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates',
};

/**
 * Devuelve la clave única del usuario: lightning address o npub.
 * Retorna null si no hay ninguna.
 */
export function getStorageKey(cardData) {
  if (cardData?.lightningAddress) return cardData.lightningAddress.toLowerCase();
  if (cardData?.npub) return cardData.npub;
  return null;
}

/**
 * Guarda la tarjeta en Supabase (upsert).
 */
export async function saveCardRemote(cardData) {
  const id = getStorageKey(cardData);
  if (!id) return;

  await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id, data: cardData, updated_at: new Date().toISOString() }),
  });
}

/**
 * Carga la tarjeta desde Supabase por clave (lightning address o npub).
 * Retorna null si no existe.
 */
export async function loadCardRemote(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cards?id=eq.${encodeURIComponent(id)}&select=data`,
    { headers }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0]?.data ?? null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** true si las variables de Supabase están configuradas. */
export const isRemoteEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

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
  if (cardData?.npub) return cardData.npub;
  if (cardData?.lnAddress) return cardData.lnAddress.toLowerCase();
  if (cardData?.lightningAddress) return cardData.lightningAddress.toLowerCase();
  return null;
}

/**
 * Verifica que una tarjeta remota corresponda realmente a la clave pedida.
 *
 * La tabla es de escritura pública, así que alguien podría guardar una fila con
 * id = "victima@dominio" pero con SU lightning address adentro, para desviar pagos.
 * Si la clave de la tarjeta no coincide con el id, la descartamos.
 */
export function isCardConsistent(id, card) {
  if (!id || !card || typeof card !== 'object') return false;
  return getStorageKey(card) === id;
}

/**
 * Guarda la tarjeta en Supabase (upsert).
 */
export async function saveCardRemote(cardData) {
  if (!isRemoteEnabled) return;
  const id = getStorageKey(cardData);
  if (!id) return;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/cards`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id, data: cardData, updated_at: new Date().toISOString() }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.status);
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }
}

/**
 * Carga la tarjeta desde Supabase por clave (lightning address o npub).
 * Retorna null si no existe o si los datos no corresponden a esa clave.
 */
export async function loadCardRemote(id) {
  if (!isRemoteEnabled || !id) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cards?id=eq.${encodeURIComponent(id)}&select=data`,
    { headers }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  const card = rows[0]?.data ?? null;
  return isCardConsistent(id, card) ? card : null;
}

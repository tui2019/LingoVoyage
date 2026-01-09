import crypto from 'crypto';

let cachedKey = null;

function getEncKey() {
  if (cachedKey) return cachedKey;
  const b64 = process.env.FIELD_ENC_KEY;
  if (!b64) throw new Error('FIELD_ENC_KEY env var is missing');

  const key = Buffer.from(b64, 'base64');
  if (key.length !== 32) throw new Error('FIELD_ENC_KEY must be 32 bytes');

  cachedKey = key;
  return cachedKey;
}

const IV_LEN = 12;
const TAG_LEN = 16;

export function encrypt(text) {
  if (typeof text !== 'string') text = String(text);

  const key = getEncKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Structure: [IV][TAG][CIPHERTEXT]
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decrypt(payloadB64) {
  if (!payloadB64) return '';

  const key = getEncKey();
  const data = Buffer.from(payloadB64, 'base64');

  // Safety: Ensure data is long enough to contain IV and Tag
  if (data.length < IV_LEN + TAG_LEN) {
    throw new Error('Invalid ciphertext: payload too short');
  }

  const iv = data.subarray(0, IV_LEN);
  const tag = data.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = data.subarray(IV_LEN + TAG_LEN);

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    // This triggers if the key is wrong or the data was tampered with
    throw new Error('Decryption failed: Integrity check failed');
  }
}

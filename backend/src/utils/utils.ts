import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function encrypt(password: string): string {
  const key = '12345678901234567890123456789012';
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(password, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decrypt(encrypted: string): string {
  const key = '12345678901234567890123456789012';
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function bcryptHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function bcryptCompare(password: string, stored: string): boolean {
  try {
    return bcrypt.compareSync(password, stored);
  } catch (_error) {
    return false;
  }
}

export function generateJwt(username: string): string {
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

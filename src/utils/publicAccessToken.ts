import crypto from 'crypto';

interface TokenPayload {
  studentId: string;
  tutorId: string;
  issuedAt: number; // timestamp in milliseconds
  expiresAt: number; // timestamp in milliseconds
}

/**
 * Generate a secure access token for public student dashboard
 * Token is base64-encoded payload + HMAC-SHA256 signature
 * Default expiration: 30 days
 */
export function generatePublicAccessToken(
  studentId: string,
  tutorId: string,
  expiresInDays: number = 30
): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error('CRITICAL CONFIGURATION ERROR: HMAC_SECRET environment variable is missing.');
  }
  const tokenSecret = secret;

  // Create payload
  const now = Date.now();
  const expiresAt = now + expiresInDays * 24 * 60 * 60 * 1000;
  
  const payload: TokenPayload = {
    studentId,
    tutorId,
    issuedAt: now,
    expiresAt,
  };

  // Encode payload as base64url (URL safe)
  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Sign with HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', tokenSecret)
    .update(payloadBase64)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Combine payload.signature
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode a public access token
 * Returns the decoded payload if valid, or an error object if invalid
 */
export function verifyPublicAccessToken(
  token: string
): { valid: boolean; payload?: TokenPayload; error?: string } {
  try {
    // Decode if URL encoded
    const decodedToken = decodeURIComponent(token);
    // Split token into payload and signature
    const [payloadBase64, signature] = decodedToken.split('.');

    if (!payloadBase64 || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    const secret = process.env.HMAC_SECRET;
    if (!secret) {
      throw new Error('CRITICAL CONFIGURATION ERROR: HMAC_SECRET environment variable is missing.');
    }
    const tokenSecret = secret;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', tokenSecret)
      .update(payloadBase64)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log('--- HMAC_SECRET Verification Debug ---');
    console.log('HMAC_SECRET in verify (first 4 chars):', tokenSecret.substring(0, 4));
    console.log('Is using fallback secret?', tokenSecret === 'default-secret-change-this-in-production-f3c3365b8bf54b6c123f765ae882a7dcaf9ccf365f5a094be8632d03874ea898');
    
    // Verify signature using timingSafeEqual
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: false, error: 'Token signature is invalid' };
    }

    // Restore standard base64 padding/chars for decoding
    let base64Standard = payloadBase64
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    while (base64Standard.length % 4) {
      base64Standard += '=';
    }

    // Decode payload
    const payloadString = Buffer.from(base64Standard, 'base64').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadString);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const expiresAtSeconds = Math.floor(payload.expiresAt / 1000);
    
    console.log('--- TOKEN VERIFICATION DEBUG ---');
    console.log('Current Time (s):', nowSeconds);
    console.log('Token Expires At (s):', expiresAtSeconds);
    console.log('Is Expired?', nowSeconds > expiresAtSeconds);

    // Check expiration (standardized on seconds)
    if (nowSeconds > expiresAtSeconds) {
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: 'Failed to verify token' };
  }
}

/**
 * Check if a token is expired (utility function)
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

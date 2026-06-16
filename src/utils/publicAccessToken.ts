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
  // Create payload
  const now = Date.now();
  const expiresAt = now + expiresInDays * 24 * 60 * 60 * 1000;
  
  const payload: TokenPayload = {
    studentId,
    tutorId,
    issuedAt: now,
    expiresAt,
  };

  // Encode payload as base64
  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString('base64');

  // Sign with HMAC-SHA256
  const secret = process.env.JWT_SECRET || 'default-secret-change-this-in-production-f3c3365b8bf54b6c123f765ae882a7dcaf9ccf365f5a094be8632d03874ea898';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadBase64)
    .digest('base64');

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
    // Split token into payload and signature
    const [payloadBase64, signature] = token.split('.');

    if (!payloadBase64 || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Verify signature
    const secret = process.env.JWT_SECRET || 'default-secret-change-this-in-production-f3c3365b8bf54b6c123f765ae882a7dcaf9ccf365f5a094be8632d03874ea898';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadBase64)
      .digest('base64');

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Token signature is invalid' };
    }

    // Decode payload
    const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadString);

    const nowSeconds = Math.floor(Date.now() / 1000);
    
    console.log('--- TOKEN VERIFICATION DEBUG ---');
    console.log('Current Time (s):', nowSeconds);
    console.log('Token Expires At (s):', payload.expiresAt);
    console.log('Is Expired?', nowSeconds > payload.expiresAt);

    // Check expiration (standardized on seconds)
    if (nowSeconds > payload.expiresAt) {
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

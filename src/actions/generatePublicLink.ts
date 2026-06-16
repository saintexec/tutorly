'use server';

import crypto from 'crypto';

interface GenerateLinkResponse {
  success: boolean;
  link?: string;
  error?: string;
}

export async function generatePublicAccessLink(
  studentId: string,
  expiresInDays: number = 30
): Promise<GenerateLinkResponse> {
  try {
    // Server-side access to actual JWT_SECRET
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return {
        success: false,
        error: 'Configuration error: JWT_SECRET not set',
      };
    }

    // Create the payload
    const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const expiresInDaysVal = 365; // Increased for testing stability
    const expiresAt = now + expiresInDaysVal * 24 * 60 * 60;

    const payload = {
      studentId,
      issuedAt: now,
      expiresAt,
    };

    console.log('--- TOKEN GENERATION DEBUG ---');
    console.log('Current Time (s):', now);
    console.log('Expires At (s):', expiresAt);
    console.log('Payload:', payload);

    // Encode payload
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Sign with server-side secret
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadBase64)
      .digest('base64');

    const token = `${payloadBase64}.${signature}`;

    // Construct the public link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const publicLink = `${baseUrl}/student/${studentId}/public?token=${token}`;

    console.log('Generated public access link:', publicLink);

    return {
      success: true,
      link: publicLink,
    };
  } catch (error) {
    console.error('Error generating public access link:', error);
    return {
      success: false,
      error: 'Failed to generate public access link',
    };
  }
}

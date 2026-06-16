'use server';

import { createClient } from '@/lib/supabase/server';
import { generatePublicAccessToken } from '@/utils/publicAccessToken';
import { BASE_URL } from '@/lib/config';

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized: You must be logged in to generate links.',
      };
    }

    const secret = process.env.HMAC_SECRET;
    if (!secret) {
      console.error('HMAC_SECRET is undefined in environment variables');
    }

    // Generate token using the shared utility function
    const token = generatePublicAccessToken(studentId, user.id, expiresInDays);

    // Construct the public link using BASE_URL from config
    const publicLink = `${BASE_URL}/student/${studentId}/public?token=${token}`;

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

'use client';

import { generatePublicAccessLink } from '@/actions/generatePublicLink';

interface StudentData {
  name: string;
  studentId: string;
  date: string;
  performance: number;
  sessionNotes: string;
  homeworkAssignments: string;
}

interface WhatsAppLinkResult {
  link: string;
  message: string;
}

/**
 * Generates WhatsApp message with public progress dashboard link
 * Token is generated server-side to ensure correct signing
 */
export async function generateWhatsAppLink(studentData: StudentData): Promise<WhatsAppLinkResult> {
  const {
    name,
    studentId,
    date,
    performance,
    sessionNotes,
    homeworkAssignments,
  } = studentData;

  try {
    // Generate public link server-side (ensures correct secret)
    const linkResponse = await generatePublicAccessLink(studentId, 30);
    
    if (!linkResponse.success || !linkResponse.link) {
      console.error('Failed to generate public link:', linkResponse.error);
      throw new Error(linkResponse.error || 'Failed to generate link');
    }

    const publicLink = linkResponse.link;

    // Create star rating string using Unicode escape for ⭐ (U+2B50)
    const starEmoji = '\u2B50';
    const stars = Array(performance).fill(starEmoji).join('');

    // Build message with emojis using Unicode escapes and include public link
    const message = `\u{1F4D1} *Session Review* \u{1F4D1}

\u{1F9D1}\u{200D}\u{1F3EB} *Student:* ${name}
\u{1F4C5} *Date:* ${date}

\u{2B50} *Performance:* ${stars} (${performance}/5)

\u{1F4DD} *Session Notes:*
${sessionNotes || 'No notes'}

\u{1F4A1} *Homework Assignments:*
${homeworkAssignments || 'No homework assigned'}

\u{1F50D} *View full progress:*
${publicLink}`;

    // Encode message for WhatsApp API
    const encodedMessage = encodeURIComponent(message);
    const link = `https://api.whatsapp.com/send?text=${encodedMessage}`;

    console.log('FINAL WHATSAPP LINK:', link);
    console.log('MESSAGE PREVIEW:', message);

    return { link, message };
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    throw error;
  }
}

/**
 * Opens WhatsApp message in a new tab with proper focus handling
 */
export function openWhatsAppMessage(link: string): void {
  if (!link) {
    console.error('WhatsApp link is empty');
    return;
  }

  try {
    const whatsappWindow = window.open(link, '_blank', 'noopener,noreferrer');
    if (whatsappWindow) {
      whatsappWindow.focus();
    } else {
      console.warn('WhatsApp window could not be opened. Pop-up blocker may be active.');
    }
  } catch (error) {
    console.error('Error opening WhatsApp link:', error);
  }
}

export function generateWhatsAppLinkWithPhone(
  studentData: StudentData,
  phoneNumber: string
): Promise<WhatsAppLinkResult> {
  // Return promise-based version for phone number handling
  return generateWhatsAppLink(studentData).then(({ link, message }) => {
    const linkWithPhone = phoneNumber
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
      : link;

    return { link: linkWithPhone, message };
  });
}

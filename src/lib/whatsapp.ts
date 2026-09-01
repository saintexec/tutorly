'use client';

import { generatePublicAccessLink } from '@/actions/generatePublicLink';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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

    // Clean up raw markdown headers from AI homework text for pristine WhatsApp rendering
    const cleanedHomework = (homeworkAssignments || 'No homework assigned')
      .replace(/###\s*\*?/g, '\n\u{1F4CC} *')
      .replace(/##\s*\*?/g, '\n\u{1F4CC} *')
      .replace(/\*\*\*/g, '*')
      .trim();

    // Build message with gorgeous emojis and clean formatting for parents
    const message = `🎓 *TUTORLY SESSION REPORT* 🎓
----------------------------------------
👤 *Student:* ${name}
📅 *Date:* ${date}
⭐ *Performance:* ${stars} *(${performance}/5)*

📝 *Session Notes:*
${sessionNotes || 'Great session today! Progress was made.'}

📚 *Homework & Tasks:*
${cleanedHomework}
----------------------------------------
👉 *Track full progress & history:*
${publicLink}

_Keep up the fantastic work!_ 💫`;

    // Encode message for WhatsApp API
    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/?text=${encodedMessage}`;

    console.log('FINAL WHATSAPP LINK:', link);
    // window.location.href = link; removed to prevent tab hijacking
    console.log('MESSAGE PREVIEW:', message);

    return { link, message };
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    throw error;
  }
}

/**
 * Opens WhatsApp message in a new tab using dynamic anchor element.
 */
export function openWhatsAppMessage(link: string): void {
  if (!link) {
    console.error('WhatsApp link is empty');
    return;
  }

  try {
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
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
    // Format: https://wa.me/PHONE?text=MESSAGE
    // Strip non-numeric characters from phone number except leading +
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^\d+]/g, '') : '';
    const linkWithPhone = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : link;

    return { link: linkWithPhone, message };
  });
}

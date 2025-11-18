import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getRemainingCredits } from '@/lib/credits';

interface GeneratePayload {
  address: string;
  propertyType: string;
  isLuxury?: boolean;
  beds?: string;
  baths?: string;
  livingArea?: string;
  lotSize?: string;
  yearBuilt?: string;
  viewType?: string;
  neighborhoodVibe?: string;
  schoolNotes?: string;
  upgrades?: string;
  photoNames?: string[];
}

const REQUIRED_FIELDS: Array<keyof GeneratePayload> = ['address', 'propertyType'];

// Rate limit configuration per README spec:
// - Guest: 2 generations per 24 hours per IP
const GUEST_RATE_LIMIT = 2;
const GUEST_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body as GeneratePayload;
  const missingFields = REQUIRED_FIELDS.filter((field) => !payload?.[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // TODO: Stage 2 – Extract userId from session/auth when Supabase is wired
  const userId = undefined; // Placeholder for authenticated user ID

  // Check credits for authenticated users
  if (userId) {
    const { plan, remaining } = await getRemainingCredits(userId);
    
    if (remaining <= 0) {
      return res.status(429).json({ 
        error: 'No credits remaining', 
        plan,
        remaining: 0
      });
    }
  } else {
    // Guest user: apply IP-based rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, GUEST_RATE_LIMIT, GUEST_WINDOW_MS);
    
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetAt);
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Guest users are limited to 2 generations per 24 hours.',
        remaining: rateLimit.remaining,
        resetAt: resetDate.toISOString()
      });
    }
  }

  // TODO: Stage 2 – replace with OpenAI call and Supabase credit enforcement per README spec.
  const response = {
    description:
      'Dummy MLS description for now. A modernized stub showing where OpenAI output will land once Stage 2 is wired.',
    captions: [
      'Caption 1: Swipe through this refreshed home with airy living spaces.',
      'Caption 2: Listing copy placeholder focused on lifestyle hooks.',
      'Caption 3: Invite followers to book a private tour.',
    ],
    videoScript: ['VO: Open with curb appeal hero shot.', 'SHOT: Slow pan across living room.', 'VO: CTA to book a showing.'],
  };

  return res.status(200).json(response);
}

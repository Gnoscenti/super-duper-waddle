import type { NextApiRequest, NextApiResponse } from 'next';

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body as GeneratePayload;
  const missingFields = REQUIRED_FIELDS.filter((field) => !payload?.[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
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

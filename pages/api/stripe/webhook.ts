import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // TODO: Stage 2 – Verify Stripe webhooks and update Supabase records per README flow.
  return res.status(501).json({ error: 'Not implemented yet – Stripe integration planned for Stage 2.' });
}

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // TODO: Stage 2 – Implement Stripe Checkout session creation referencing README pricing spec.
  return res.status(501).json({ error: 'Not implemented yet – Stripe integration planned for Stage 2.' });
}

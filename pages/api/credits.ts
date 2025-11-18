import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // TODO: Stage 2 – Replace with Supabase-backed credit tracking per README data model.
  return res.status(200).json({ planType: 'GUEST', remaining: 2 });
}

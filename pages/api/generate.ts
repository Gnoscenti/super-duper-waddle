import type { NextApiRequest, NextApiResponse } from 'next';
import { getRemainingCredits } from '../../lib/credits';
import { generateListingCopy, ListingInput } from '../../lib/openai';
import { checkRateLimit, getClientIp } from '../../lib/rateLimit';

interface GeneratePayload {
  address?: string;
  propertyType?: string;
  isLuxury?: boolean;
  beds?: string | number;
  baths?: string | number;
  livingArea?: string | number;
  lotSize?: string | number;
  yearBuilt?: string | number;
  viewType?: string;
  neighborhoodVibe?: string;
  schoolNotes?: string;
  upgrades?: string | string[];
}

function parseNumberField(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseUpgrades(value: GeneratePayload['upgrades']): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function validateRequiredString(fieldValue: unknown, fieldName: string, errors: string[]): string | null {
  if (typeof fieldValue !== 'string' || fieldValue.trim().length === 0) {
    errors.push(fieldName);
    return null;
  }
  return fieldValue.trim();
}

function validateRequiredNumber(value: unknown, fieldName: string, errors: string[]): number | null {
  const parsed = parseNumberField(value);
  if (parsed === null) {
    errors.push(fieldName);
    return null;
  }
  return parsed;
}

function getOptionalString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

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
  const errors: string[] = [];

  const address = validateRequiredString(payload.address, 'address', errors);
  const propertyType = validateRequiredString(payload.propertyType, 'propertyType', errors);
  const beds = validateRequiredNumber(payload.beds, 'beds', errors);
  const baths = validateRequiredNumber(payload.baths, 'baths', errors);
  const livingSqft = validateRequiredNumber(payload.livingArea, 'livingArea', errors);
  const viewType = getOptionalString(payload.viewType, 'None');
  const neighborhoodVibe = getOptionalString(payload.neighborhoodVibe, 'Neutral');

  if (errors.length > 0 || !address || !propertyType || beds === null || baths === null || livingSqft === null) {
    return res.status(400).json({ error: `Missing or invalid fields: ${[...new Set(errors)].join(', ')}` });
  }

  // TODO: Stage 2 – Extract userId from session/auth when Supabase is wired
  const userId = undefined; // Placeholder for authenticated user ID

  if (userId) {
    const { plan, remaining } = await getRemainingCredits(userId);

    if (remaining <= 0) {
      return res.status(429).json({
        error: 'No credits remaining',
        plan,
        remaining: 0,
      });
    }
  } else {
    const clientIp = getClientIp(req);
    if (!clientIp) {
      return res.status(400).json({ error: 'Unable to determine client IP for rate limiting.' });
    }
    const rateLimit = checkRateLimit(clientIp, GUEST_RATE_LIMIT, GUEST_WINDOW_MS);

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetAt);
      return res.status(429).json({
        error: 'Rate limit exceeded. Guest users are limited to 2 generations per 24 hours.',
        remaining: rateLimit.remaining,
        resetAt: resetDate.toISOString(),
      });
    }
  }

  const listingInput: ListingInput = {
    address,
    propertyType,
    beds,
    baths,
    livingSqft,
    lotSqft: parseNumberField(payload.lotSize),
    yearBuilt: parseNumberField(payload.yearBuilt),
    viewType,
    neighborhoodVibe,
    schoolNotes: payload.schoolNotes?.trim() ? payload.schoolNotes.trim() : null,
    upgrades: parseUpgrades(payload.upgrades),
    isLuxury: Boolean(payload.isLuxury),
  };

  try {
    const result = await generateListingCopy(listingInput);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating listing copy', error);
    return res.status(500).json({ error: 'Failed to generate listing copy. Please try again later.' });
  }
}

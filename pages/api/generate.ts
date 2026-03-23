import type { NextApiRequest, NextApiResponse } from 'next';
import { generateListingCopy, ListingInput } from '../../lib/openai';

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
    return value.map((item) => item.trim()).filter(Boolean);
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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
  const viewType = validateRequiredString(payload.viewType, 'viewType', errors);
  const neighborhoodVibe = validateRequiredString(payload.neighborhoodVibe, 'neighborhoodVibe', errors);

  if (errors.length > 0 || !address || !propertyType || beds === null || baths === null || livingSqft === null || !viewType || !neighborhoodVibe) {
    return res.status(400).json({ error: `Missing or invalid fields: ${[...new Set(errors)].join(', ')}` });
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

import OpenAI from 'openai';

export interface ListingInput {
  address: string;
  propertyType: string;
  beds: number;
  baths: number;
  livingSqft: number;
  lotSqft?: number | null;
  yearBuilt?: number | null;
  viewType: string;
  neighborhoodVibe: string;
  schoolNotes?: string | null;
  upgrades: string[];
  isLuxury: boolean;
}

export interface ListingOutput {
  description: string;
  captions: string[];
  videoScript: string[];
}

const SYSTEM_PROMPT = `You are a professional listing copywriter in San Diego specializing in MLS descriptions, social captions, and short video scripts.
You must:
- Be factually accurate and avoid unverifiable claims.
- Avoid any discriminatory or fair-housing violations.
- Avoid absolute language like 'best', 'perfect for families', or 'safe neighborhood'.
- Describe features, not people.`;

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!cachedClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
}

function isListingOutput(payload: any): payload is ListingOutput {
  return (
    payload &&
    typeof payload.description === 'string' &&
    Array.isArray(payload.captions) &&
    payload.captions.every((caption: unknown) => typeof caption === 'string') &&
    Array.isArray(payload.videoScript) &&
    payload.videoScript.every((line: unknown) => typeof line === 'string')
  );
}

export async function generateListingCopy(input: ListingInput): Promise<ListingOutput> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.5,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate MLS description, three social captions, and a 30-second vertical video script as JSON using this property data: ${JSON.stringify(
          input,
        )}`,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error('Failed to parse OpenAI response JSON');
  }

  if (!isListingOutput(parsed)) {
    throw new Error('OpenAI response did not match expected shape.');
  }

  return parsed;
}

export interface GenerateListingInput {
  address: string;
  propertyType: string;
  beds?: number;
  baths?: number;
  livingArea?: number;
  lotSize?: number;
  yearBuilt?: number;
  upgrades?: string;
  schoolNotes?: string;
  viewType?: string;
  neighborhoodVibe?: string;
  isLuxury?: boolean;
}

export interface ListingCopyPayload {
  description: string;
  captions: string[];
  videoScript: string[];
}

export async function generateListingCopy(_input: GenerateListingInput): Promise<ListingCopyPayload> {
  // TODO: Stage 2 – connect to OpenAI (e.g., gpt-4o-mini) with structured prompt from README spec.
  return {
    description: 'OpenAI placeholder response. Replace once API wiring is complete.',
    captions: ['Placeholder caption'],
    videoScript: ['VO: Placeholder'],
  };
}

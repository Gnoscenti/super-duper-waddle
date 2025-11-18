import type { ChangeEvent } from 'react';

interface Step2Values {
  beds: string;
  baths: string;
  livingArea: string;
  lotSize: string;
  yearBuilt: string;
  viewType: string;
  neighborhoodVibe: string;
  schoolNotes: string;
  upgrades: string;
  photoNames: string[];
}

interface PropertyFormStep2Props {
  values: Step2Values;
  onChange: (updates: Partial<Step2Values>) => void;
  onBack: () => void;
  onNext: () => void;
}

const viewTypes = ['None', 'City', 'Ocean', 'Mountain', 'Canyon', 'Golf', 'Other'];
const neighborhoodVibes = ['Family', 'Luxury', 'Coastal', 'Equestrian', 'Urban', 'Rural', 'Investment'];

export default function PropertyFormStep2({ values, onChange, onBack, onNext }: PropertyFormStep2Props) {
  const isValid = Boolean(values.beds) && Boolean(values.baths) && Boolean(values.livingArea);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    onChange({ photoNames: files.map((file) => file.name).slice(0, 6) });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Beds</label>
          <input
            type="number"
            value={values.beds}
            onChange={(event) => onChange({ beds: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Baths</label>
          <input
            type="number"
            value={values.baths}
            onChange={(event) => onChange({ baths: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Living area (sq ft)</label>
          <input
            type="number"
            value={values.livingArea}
            onChange={(event) => onChange({ livingArea: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Lot size (optional)</label>
          <input
            type="number"
            value={values.lotSize}
            onChange={(event) => onChange({ lotSize: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Year built (optional)</label>
          <input
            type="number"
            value={values.yearBuilt}
            onChange={(event) => onChange({ yearBuilt: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">View type</label>
          <select
            value={values.viewType}
            onChange={(event) => onChange({ viewType: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          >
            <option value="">Select</option>
            {viewTypes.map((view) => (
              <option key={view} value={view}>
                {view}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Neighborhood vibe</label>
          <select
            value={values.neighborhoodVibe}
            onChange={(event) => onChange({ neighborhoodVibe: event.target.value })}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          >
            <option value="">Select</option>
            {neighborhoodVibes.map((vibe) => (
              <option key={vibe} value={vibe}>
                {vibe}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">School notes (optional)</label>
          <textarea
            value={values.schoolNotes}
            onChange={(event) => onChange({ schoolNotes: event.target.value })}
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Upgrades (comma separated)</label>
          <textarea
            value={values.upgrades}
            onChange={(event) => onChange({ upgrades: event.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-4 py-3"
            placeholder="Chef's kitchen, 2022 roof, new HVAC"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Photos (up to 6)</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm" />
        {values.photoNames.length > 0 && (
          <p className="mt-2 text-xs text-slate-500">Selected: {values.photoNames.join(', ')}</p>
        )}
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="rounded-lg border border-slate-200 px-6 py-3 text-slate-700">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="rounded-lg bg-brand-600 px-6 py-3 text-white hover:bg-brand-500 disabled:cursor-not-allowed"
        >
          Generate draft
        </button>
      </div>
    </div>
  );
}

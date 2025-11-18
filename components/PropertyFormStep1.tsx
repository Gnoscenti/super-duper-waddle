interface Step1Values {
  address: string;
  propertyType: string;
  isLuxury: boolean;
}

interface PropertyFormStep1Props {
  values: Step1Values;
  onChange: (updates: Partial<Step1Values>) => void;
  onNext: () => void;
}

const propertyTypes = ['Detached', 'Condo', 'Townhome', 'Multi-Unit', 'Land'];

export default function PropertyFormStep1({ values, onChange, onNext }: PropertyFormStep1Props) {
  const isValid = values.address.trim().length > 5 && values.propertyType.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Property address</label>
        <input
          type="text"
          value={values.address}
          onChange={(event) => onChange({ address: event.target.value })}
          placeholder="123 Palm Ave, Miami, FL"
          className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Property type</label>
        <select
          value={values.propertyType}
          onChange={(event) => onChange({ propertyType: event.target.value })}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
        >
          <option value="">Select a type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Luxury / High-End Listing</p>
          <p className="text-xs text-slate-500">Adds more aspirational tone per spec.</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ isLuxury: !values.isLuxury })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            values.isLuxury ? 'bg-brand-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              values.isLuxury ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="rounded-lg bg-brand-600 px-6 py-3 text-white hover:bg-brand-500 disabled:cursor-not-allowed"
        >
          Continue to details
        </button>
      </div>
    </div>
  );
}

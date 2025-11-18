interface ResultsPanelProps {
  description: string;
  captions: string[];
  videoScript: string[];
  isLoading: boolean;
  onReset: () => void;
}

const copyToClipboard = async (text: string) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    console.warn('Clipboard unavailable in this environment');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.warn('Clipboard unavailable', error);
  }
};

export default function ResultsPanel({ description, captions, videoScript, isLoading, onReset }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">Generating listing package… (stubbed response for Stage 1)</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">MLS Description</h3>
          <button
            type="button"
            className="text-sm text-brand-600 hover:text-brand-500"
            onClick={() => copyToClipboard(description)}
          >
            Copy
          </button>
        </div>
        <p className="mt-4 whitespace-pre-line text-slate-700">{description}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Social Captions</h3>
          <button
            type="button"
            className="text-sm text-brand-600 hover:text-brand-500"
            onClick={() => copyToClipboard(captions.join('\n'))}
          >
            Copy all
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {captions.map((caption, index) => (
            <div key={index} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Caption {index + 1}</span>
                <button type="button" className="text-xs text-brand-600" onClick={() => copyToClipboard(caption)}>
                  Copy
                </button>
              </div>
              <p>{caption}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Vertical Video Script</h3>
          <button
            type="button"
            className="text-sm text-brand-600 hover:text-brand-500"
            onClick={() => copyToClipboard(videoScript.join('\n'))}
          >
            Copy
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {videoScript.map((line, index) => (
            <li key={index} className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-200 px-6 py-3 text-slate-700 hover:border-brand-600 hover:text-brand-600"
        >
          Start another listing
        </button>
      </div>
    </div>
  );
}

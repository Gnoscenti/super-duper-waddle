import { useState } from 'react';
import PropertyFormStep1 from '../../components/PropertyFormStep1';
import PropertyFormStep2 from '../../components/PropertyFormStep2';
import ResultsPanel from '../../components/ResultsPanel';
import Stepper from '../../components/Stepper';

interface Step1Values {
  address: string;
  propertyType: string;
  isLuxury: boolean;
}

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

interface ListingResults {
  description: string;
  captions: string[];
  videoScript: string[];
}

const initialStep1: Step1Values = {
  address: '',
  propertyType: '',
  isLuxury: false,
};

const initialStep2: Step2Values = {
  beds: '',
  baths: '',
  livingArea: '',
  lotSize: '',
  yearBuilt: '',
  viewType: '',
  neighborhoodVibe: '',
  schoolNotes: '',
  upgrades: '',
  photoNames: [],
};

const initialResults: ListingResults = {
  description: '',
  captions: [],
  videoScript: [],
};

export default function AppWizardPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [step1Values, setStep1Values] = useState<Step1Values>(initialStep1);
  const [step2Values, setStep2Values] = useState<Step2Values>(initialStep2);
  const [results, setResults] = useState<ListingResults>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setCurrentStep(3);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...step1Values,
          ...step2Values,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate listing copy.');
      }

      const data: ListingResults = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Generation failed. Please try again once Stage 2 wiring is complete.');
      setResults(initialResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep1Values(initialStep1);
    setStep2Values(initialStep2);
    setResults(initialResults);
    setCurrentStep(1);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8">
          <Stepper currentStep={currentStep} />
        </div>

        {currentStep === 1 && (
          <PropertyFormStep1
            values={step1Values}
            onChange={(updates) => setStep1Values((prev) => ({ ...prev, ...updates }))}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <PropertyFormStep2
            values={step2Values}
            onChange={(updates) => setStep2Values((prev) => ({ ...prev, ...updates }))}
            onBack={() => setCurrentStep(1)}
            onNext={handleGenerate}
          />
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <ResultsPanel
              description={
                results.description || 'Dummy MLS description for now. TODO: replace with OpenAI output (Stage 2).'
              }
              captions={
                results.captions.length > 0
                  ? results.captions
                  : ['Caption placeholder 1', 'Caption placeholder 2', 'Caption placeholder 3']
              }
              videoScript={
                results.videoScript.length > 0
                  ? results.videoScript
                  : ['VO: Placeholder line', 'SHOT: Placeholder shot']
              }
              isLoading={isLoading}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Results' },
];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <ol className="flex w-full items-center justify-between gap-4">
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = step.id < currentStep;
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  isActive
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : isCompleted
                      ? 'border-brand-600 bg-brand-50 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                {step.id}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
            {step.id !== steps.length && (
              <div className={`mx-4 hidden h-px flex-1 sm:block ${isCompleted ? 'bg-brand-200' : 'bg-slate-200'}`}></div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface PricingCardsProps {
  onSelect?: (plan: 'SINGLE' | 'SUBSCRIPTION') => void;
}

const plans = [
  {
    id: 'SINGLE' as const,
    name: 'Single Listing',
    price: '$9',
    description: 'One-off credit. Perfect for testing AgentOS Listing Copy.',
    perks: ['1 generation', 'Download results instantly', 'Email support'],
  },
  {
    id: 'SUBSCRIPTION' as const,
    name: 'Agent Pro',
    price: '$19/mo',
    description: 'Monthly plan with a steady quota for active agents.',
    perks: ['8 generations per month', 'Priority support', 'Bonus templates coming soon'],
  },
];

export default function PricingCards({ onSelect }: PricingCardsProps) {
  const handleSelect = (plan: 'SINGLE' | 'SUBSCRIPTION') => {
    if (onSelect) {
      onSelect(plan);
    } else {
      console.info(`TODO: wire Stripe checkout for ${plan}`);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-slate-900">{plan.price}</p>
            <p className="text-sm text-slate-500">{plan.id === 'SINGLE' ? 'one-time' : 'per month'}</p>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" aria-hidden />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 text-white hover:bg-brand-500"
            onClick={() => handleSelect(plan.id)}
          >
            {plan.id === 'SINGLE' ? 'Buy single credit' : 'Start subscription'}
          </button>
        </div>
      ))}
    </div>
  );
}

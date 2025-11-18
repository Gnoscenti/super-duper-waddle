import Link from 'next/link';
import PricingCards from '../components/PricingCards';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-500 px-8 py-16 text-white shadow-xl">
        <p className="text-sm uppercase tracking-wide text-white/80">AgentOS Listing Copy · MVP</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Turn any address into a full listing package in seconds
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          Feed in the property basics. Get MLS descriptions, social captions, and a 30-second video script with zero
          copy/paste gymnastics.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/app"
            className="rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-brand-600 shadow hover:bg-white"
          >
            Try it now
          </Link>
          <a href="#pricing" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white">
            View pricing
          </a>
        </div>
      </section>

      <section className="mt-16 grid gap-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm sm:grid-cols-3">
        {[1, 2, 3].map((step) => {
          const titles = ['Address & vibe', 'Property facts', 'Instant results'];
          const descriptions = [
            'Drop an address, property type, and flag luxury tone.',
            'Beds, baths, upgrades, school notes, and optional photos.',
            'Preview MLS copy, social captions, and a short-form video script.',
          ];
          return (
            <div key={step}>
              <p className="text-sm font-semibold text-brand-600">Step {step}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{titles[step - 1]}</h3>
              <p className="mt-2 text-sm text-slate-600">{descriptions[step - 1]}</p>
            </div>
          );
        })}
      </section>

      <section id="pricing" className="mt-16">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Credits that match your workflow</h2>
          <p className="mt-2 text-base text-slate-600">Single or subscription plans per MVP spec.</p>
        </div>
        <PricingCards />
      </section>
    </div>
  );
}

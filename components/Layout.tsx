import Link from 'next/link';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold text-brand-600">
            AgentOS Listing Copy
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="/app" className="rounded-full bg-brand-600 px-4 py-2 text-white hover:bg-brand-500">
              Launch app
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="sm:hidden flex flex-col gap-1.5 p-2 rounded-md text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="sm:hidden border-t border-slate-100 bg-white/95 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
            <Link href="/" className="text-slate-700 hover:text-slate-900" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-brand-600 px-4 py-2 text-white text-center hover:bg-brand-500"
              onClick={() => setMenuOpen(false)}
            >
              Launch app
            </Link>
          </nav>
        )}
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AgentOS. All rights reserved.</p>
          <p>Stage 1 scaffolding — TODO: wire Supabase + Stripe + OpenAI.</p>
        </div>
      </footer>
    </div>
  );
}

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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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

          {/* Mobile hamburger button */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-slate-100"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="sm:hidden border-t bg-white px-6 py-4 flex flex-col gap-3 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/app"
              className="w-full rounded-full bg-brand-600 px-4 py-2 text-center text-white hover:bg-brand-500"
              onClick={() => setMenuOpen(false)}
            >
              Launch app
            </Link>
          </nav>
        )}
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AgentOS. All rights reserved.</p>
          <p>Stage 1 scaffolding — TODO: wire Supabase + Stripe + OpenAI.</p>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-brand-600">
            AgentOS Listing Copy
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="/app" className="rounded-full bg-brand-600 px-4 py-2 text-white hover:bg-brand-500">
              Launch app
            </Link>
          </nav>
        </div>
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

'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header>
      <div className="wrap header-row flex items-center justify-between h-[64px] gap-8">
        <Link href="/" className="logo flex items-center gap-2 font-bold text-[19px] tracking-[-0.02em]">
          <span className="mark w-[14px] h-[14px] bg-[var(--ink)] inline-block" /> F4C
        </Link>
        
        <div className="search-shell flex-1 max-w-[420px] flex items-center gap-2 border-b border-[var(--border)] py-2 px-0.5 focus-within:border-[var(--ink)] transition-colors">
          <span className="prompt mono text-[13px] text-[var(--muted)]">&gt;</span>
          <input type="text" placeholder="search creator handle — any linked platform" className="border-none outline-none text-[13px] w-full bg-transparent placeholder-[#a8a8a1] text-[var(--ink)]" />
        </div>
        
        <div className="nav-right flex items-center gap-4">
          <Link href="/auth/login" className="link-plain text-[13.5px] font-medium text-[var(--ink)]">Log in</Link>
          <Link href="/become-creator" className="btn-bracket mono inline-flex items-center gap-0.5 bg-[var(--ink)] text-white text-[12.5px] font-medium px-3 py-2 rounded-[var(--radius)]">[ become a creator — £5 ]</Link>
        </div>
      </div>
    </header>
  );
}

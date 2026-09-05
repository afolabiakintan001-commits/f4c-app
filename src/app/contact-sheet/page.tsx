'use client';

import { useState } from 'react';
import { CategoryLedger } from '@/components/contact-sheet/CategoryLedger';
import { CreatorsTicker } from '@/components/contact-sheet/CreatorsTicker';
import { ReadoutPanel } from '@/components/contact-sheet/ReadoutPanel';
import { ContactSheet } from '@/components/contact-sheet/ContactSheet';

export default function ContactSheetPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-white">
      <ReadoutPanel />
      <CreatorsTicker />
      
      {/* Search Input wire-up */}
      <div className="p-4 font-mono text-sm border-b border-neutral-200">
        {'> '}
        <input 
          type="text" 
          placeholder="search creator handle..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none"
        />
      </div>
      
      <CategoryLedger />
      <ContactSheet searchQuery={searchQuery} />
    </main>
  );
}

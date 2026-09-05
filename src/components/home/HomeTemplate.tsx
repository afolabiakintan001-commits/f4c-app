import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function HomeTemplate() {
  return (
    <div className="wrap">
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow"><span className="sq"></span><span>ONE-OF-ONE ASSET VAULT</span></div>
          <h1>Full resolution.<br/>Zero compression.</h1>
          <p>Verified creators host original PNGs, overlays and 4K wallpapers here, untouched by platform compression or watermarks. Find any linked handle, pull the master file.</p>
          <div className="hero-ctas">
            <a href="#" className="btn-solid">Submit work</a>
            <a href="#" className="btn-outline">Explore vault</a>
          </div>
        </div>
        <div className="readout">
          <div className="readout-title">vault status</div>
          <div className="readout-row"><span className="k">files indexed</span><span className="v">12,438</span></div>
          <div className="readout-row"><span className="k">min. resolution</span><span className="v">4096×2304</span></div>
          <div className="readout-row"><span className="k">formats</span><span className="v">PNG · PSD · MOV</span></div>
          <div className="readout-row"><span className="k">watermarks</span><span className="v">0<span className="cursor-blink"></span></span></div>
        </div>
      </section>

      <div className="creators-strip">
        <span className="cs-label">trending —</span>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c1/60/60)"}}></div><span className="handle">@rin_edits</span><span className="sq-verified"></span></div>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c2/60/60)"}}></div><span className="handle">@driftframes</span><span className="sq-verified"></span></div>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c3/60/60)"}}></div><span className="handle">@textureforge</span><span className="sq-verified"></span></div>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c4/60/60)"}}></div><span className="handle">@nightcity3d</span><span className="sq-verified"></span></div>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c5/60/60)"}}></div><span className="handle">@filmgrain_k</span><span className="sq-verified"></span></div>
        <div className="creator-chip"><div className="avatar" style={{backgroundImage:"url(https://picsum.photos/seed/c6/60/60)"}}></div><span className="handle">@vaporlens</span><span className="sq-verified"></span></div>
      </div>

      <div className="ruler">
        <span>showing 001–024 of 12,438</span>
        <div className="ruler-ticks">
            {[...Array(16)].map((_,i) => <div key={i} className="tick"></div>)}
        </div>
        <span>sorted by newest</span>
      </div>

      <div className="contact-sheet" id="sheet"></div>
    </div>
  );
}

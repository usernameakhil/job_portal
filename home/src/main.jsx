// core-home/src/main.jsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function ApEmploymentPortal() {
  const [language, setLanguage] = useState('English');
  const [metrics, setMetrics] = useState({ totalTrained: 750264 });

  // 📡 Real-time Dashboard Count Multi-Tenant Verification Pull
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/management/public-aggregates')
      .then(res => res.json())
      .then(data => {
        if (data.totalTrained) setMetrics({ totalTrained: data.totalTrained });
      })
      .catch(() => console.log('Using local sandbox metrics cache state.'));
  }, []);

  const routeToTenant = (port) => {
    window.location.href = `http://localhost:${port}/`;
  };

  // Bilingual UI Localization Dictionary Matrix
  const t = {
    English: {
      title: 'AP Job Portal',
      subtitle: 'Government of Andhra Pradesh',
      heroTag: 'AP STATE SKILL INTERACTION MATRIX',
      heroHeading: 'Connecting Andhra’s Brightest Youth with Global Opportunities',
      heroSub: 'A unified, multi-tenant digital ecosystem balancing citizen skill development, corporate workforce deployment, and executive structural analytics.',
      counterLabel: 'State-wide Candidates Trained',
      
      seekerTitle: 'Youth Employment Hub',
      seekerDesc: 'Build a verified digital bio-data portfolio synced directly with official state records, apply to verified jobs, and access upskilling courses.',
      seekerBtn: 'get access →',
      
      recruiterTitle: 'Corporate Exchange',
      recruiterDesc: 'Secure corporate login via CIN validation. Publish job specifications and run analytical screening searches via our double-blind anonymity matrix.',
      recruiterBtn: 'get access →',
      
      mgmtTitle: 'State Command Center',
      mgmtDesc: 'Executive control tower framework aggregating macro analytics, spatial district candidate densities, and caste-based reservation monitoring rules.',
      mgmtBtn: 'get access →',
      
      ticker: 'Live Notice:',
      tickerMsg: 'Register for the official Ugadi Kanuka Job Calendar Placement Drive 2026. Data syncing pipelines are active state-wide.'
    },
    Telugu: {
      title: 'నైపుణ్యం పోర్టల్',
      subtitle: 'నైపుణ్యాభివృద్ధి & శిక్షణ శాఖ • ఆంధ్రప్రదేశ్ ప్రభుత్వం',
      heroTag: 'ఆంధ్రప్రదేశ్ రాష్ట్ర నైపుణ్యాల అనుసంధాన వేదిక',
      heroHeading: 'ఆంధ్రప్రదేశ్ యువతకు అంతర్జాతీయ ఉపాధి అవకాశాలు',
      heroSub: 'పౌరుల నైపుణ్యాభివృద్ధి, కార్పొరేట్ ఉద్యోగ నియామకాలు మరియు కార్యాచరణ విశ్లేషణలను సమతుల్యం చేసే ఏకీకృత డిజిటల్ వ్యవస్థ.',
      counterLabel: 'రాష్ట్రవ్యాప్తంగా శిక్షణ పొందిన అభ్యర్థులు',
      
      seekerTitle: 'యువత ఉపాధి కేంద్రం',
      seekerDesc: 'అధికారిక రికార్డులతో మీ ప్రొఫైల్‌ను ధృవీకరించుకోండి, స్మార్ట్ జాబ్ ఫీడ్‌లను యాక్సెస్ చేయండి మరియు నైపుణ్య శిక్షణ కోర్సుల కోసం నమోదు చేసుకోండి.',
      seekerBtn: 'అభ్యర్థి లాగిన్ →',
      
      recruiterTitle: 'కార్పొరేట్ ఎక్స్ఛేంజ్',
      recruiterDesc: 'CIN ధృవీకరణ ద్వారా సురక్షిత లాగిన్. ఉద్యోగ ప్రకటనలను ప్రచురించండి మరియు డబుల్-బ్లైండ్ విధానంలో అభ్యర్థులను ఎంపిక చేసుకోండి.',
      recruiterBtn: 'నియామకదారుల లాగిన్ →',
      
      mgmtTitle: 'స్టేట్ కమాండ్ సెంటర్',
      mgmtDesc: 'రాష్ట్రవ్యాప్త విశ్లేషణలు, జిల్లాల వారీగా అభ్యర్థుల లభ్యత మరియు రిజర్వేషన్ వర్గాల పర్యవేక్షణ కోసం ఎగ్జిక్యూటివ్ కంట్రోల్ టవర్.',
      mgmtBtn: 'మేనేజ్మెంట్ పోర్టల్ →',
      
      ticker: 'తాజా సమాచారం:',
      tickerMsg: 'ఉగాది కానుక జాబ్ క్యాలెండర్ ప్లేస్‌మెంట్ డ్రైవ్ 2026 కొరకు నమోదు చేసుకోండి. డేటా సింకింగ్ లైన్లు యాక్టివ్‌గా ఉన్నాయి.'
    }
  }[language];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-800 selection:text-white">
      
      {/* 🏛️ 1. STATE EXECUTIVE IDENTITY NAVIGATION HEADER */}
      <header className="bg-white/90 border-b border-slate-200/80 sticky top-0 z-50 glass-panel px-4 sm:px-8 py-3.5 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-amber-400 shrink-0">
            AP
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{t.title}</h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          
          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Language Selection Switch Dropdown Component */}
          <select 
            className="p-2 border border-slate-300 rounded-xl bg-white text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
            value={language} onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">🌐 English</option>
            <option value="Telugu">🌐 తెలుగు</option>
          </select>
        </div>
      </header>

      {/* 🌟 2. ELITE HERO INTRO SECTION */}
      <section className="max-w-4xl mx-auto text-center px-4 pt-12 pb-6 space-y-4">
        
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          {t.heroHeading}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          {t.heroSub}
        </p>

        {/* Dynamic Macro Metrics Counter Board */}
        
      </section>

      {/* 📦 3. THREE IMPRESSIVE HIGH-FIDELITY PILLAR ARCHITECTURE CARDS */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-10 pb-16 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Pillar 1: Job Seeker Gateway Card */}
          <div className="pillar-card group">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500" />
            <div className="h-52 bg-cover bg-center bg-slate-100 border-b border-slate-100" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80')` }} />
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest font-mono"> Citizens</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.seekerTitle}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.seekerDesc}</p>
              </div>
              <button 
                onClick={() => routeToTenant(5173)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-600/10"
              >
                {t.seekerBtn}
              </button>
            </div>
          </div>

          {/* Pillar 2: Corporate Recruiter Portal Card */}
          <div className="pillar-card group">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600" />
            <div className="h-52 bg-cover bg-center bg-slate-100 border-b border-slate-100" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80')` }} />
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest font-mono"> Corporate Exchange</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.recruiterTitle}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.recruiterDesc}</p>
              </div>
              <button 
                onClick={() => routeToTenant(5174)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-slate-900/10"
              >
                {t.recruiterBtn}
              </button>
            </div>
          </div>

          {/* Pillar 3: Executive Management Dashboard Card */}
          <div className="pillar-card group">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500" />
            <div className="h-52 bg-cover bg-center bg-slate-100 border-b border-slate-100" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80')` }} />
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest font-mono"> State Authority</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.mgmtTitle}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.mgmtDesc}</p>
              </div>
              <button 
                onClick={() => routeToTenant(5176)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-9ading text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-amber-500/10"
              >
                {t.mgmtBtn}
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* 📣 4. SYSTEM BROADCAST MARQUEE FOOTER TRACK */}
      <footer className="w-full bg-amber-400 border-t border-amber-500 overflow-hidden shrink-0 flex items-center">
        <div className="bg-amber-500 text-slate-900 font-black px-6 py-4 text-xs uppercase tracking-widest border-r border-amber-600 font-mono whitespace-nowrap shadow-md z-10">
          {t.ticker}
        </div>
        <div className="flex-grow font-bold text-slate-900 text-xs px-4 truncate animate-pulse">
          🔥 {t.tickerMsg}
        </div>
      </footer>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<ApEmploymentPortal />);
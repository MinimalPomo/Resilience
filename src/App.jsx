import React, { useState, useEffect } from 'react';

/**
 * THE VOID - V3.0.7
 * Scroll Optimization: Replaced animated transform grain with a static SVG noise filter.
 * This eliminates the "Composite Layers" bottleneck that causes scrolling stutter.
 */

const App = () => {
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('v3_start');
    return saved ? parseInt(saved) : Date.now();
  });
  const [longestStreak, setLongestStreak] = useState(() => {
    const saved = localStorage.getItem('v3_longest');
    return saved ? parseInt(saved) : 0;
  });
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('v3_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState('main'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState({ d: 0, h: '00', m: '00', s: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0'),
        m: Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0'),
        s: Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem('v3_longest', longestStreak.toString());
    localStorage.setItem('v3_history', JSON.stringify(history));
  }, [longestStreak, history]);

  const confirmRelapse = () => {
    const now = Date.now();
    const currentDays = Math.floor((now - startTime) / 86400000);
    if (currentDays > longestStreak) setLongestStreak(currentDays);
    setHistory(prev => [{ id: now, date: new Date().toISOString(), duration: currentDays }, ...prev].slice(0, 20));
    setStartTime(now);
    localStorage.setItem('v3_start', now.toString());
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1a1a1a] font-serif selection:bg-[#1a1a1a] selection:text-[#f4f1ea] relative overflow-x-hidden">
      
      {/* Hidden SVG Filter for High-Performance Grain */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0">
        <filter id="void-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
        </filter>
      </svg>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes digitPulse {
          0% { transform: translateY(5px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .noise-layer {
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          filter: url(#void-grain);
          mix-blend-mode: multiply;
          opacity: 0.4;
        }

        .view-transition {
          transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
                      transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .view-hidden {
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          position: absolute;
          width: 100%;
        }

        .view-visible {
          opacity: 1;
          transform: translateY(0);
          position: relative;
          animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .digit-anim {
          display: inline-block;
          animation: digitPulse 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .nav-underline {
          height: 3px;
          background: #1a1a1a;
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          transition: transform 0.3s ease;
          transform-origin: left;
        }

        .ink-border { border: 3px solid #1a1a1a; }
        .xerox-shadow { 
          box-shadow: 6px 6px 0px 0px #1a1a1a; 
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .card-hover:hover {
          transform: translate(-2px, -2px);
          box-shadow: 10px 10px 0px 0px #1a1a1a;
        }

        .tap-active:active { 
          transform: scale(0.98) translate(2px, 2px); 
          box-shadow: 2px 2px 0px 0px #1a1a1a; 
        }

        .modal-enter {
          animation: slideUp 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* Optimization: Smoother scrolling by disabling pointer events on decorative layers */
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* Static Noise Layer - Replaces the heavy animation */}
      <div className="noise-layer" />

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b-4 border-[#1a1a1a] pb-4 mb-12">
          <div className="view-visible">
            <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">THE VOID</h1>
            <p className="text-[10px] md:text-xs uppercase font-bold tracking-[.3em] opacity-60">Issue No. 042 // Daily Log of Resistance</p>
          </div>
          
          <nav className="flex gap-8 mt-6 md:mt-0 font-bold uppercase text-[10px] tracking-widest relative">
            <button onClick={() => setView('main')} className={`relative pb-1 transition-all duration-300 ${view === 'main' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}>
              System.Log
              {view === 'main' && <div className="nav-underline" />}
            </button>
            <button onClick={() => setView('history')} className={`relative pb-1 transition-all duration-300 ${view === 'history' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}>
              Chronicles
              {view === 'history' && <div className="nav-underline" />}
            </button>
          </nav>
        </header>

        <div className="relative min-h-[500px]">
          {/* Main View */}
          <div className={`view-transition ${view === 'main' ? 'view-visible' : 'view-hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-8 bg-[#f4f1ea] ink-border p-8 md:p-12 xerox-shadow card-hover relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[10px] font-bold opacity-20 font-mono">PRINT_REF: 00-293-X</div>
                <div className="border-b-2 border-[#1a1a1a] pb-1 mb-8 inline-block">
                  <span className="text-[10px] font-bold uppercase tracking-[.2em] italic">Current Epoch</span>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter">
                    <span key={time.d} className="digit-anim">{time.d}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-black uppercase rotate-90 origin-left translate-x-12 translate-y-10 tracking-tighter">DAYS</span>
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-6 border-t-2 border-[#1a1a1a] pt-8 font-mono">
                  <div className="flex flex-col">
                    <span key={time.h} className="text-4xl font-black digit-anim">{time.h}</span>
                    <span className="text-[10px] uppercase font-bold opacity-40">Hours</span>
                  </div>
                  <div className="flex flex-col">
                    <span key={time.m} className="text-4xl font-black digit-anim">{time.m}</span>
                    <span className="text-[10px] uppercase font-bold opacity-40">Minutes</span>
                  </div>
                  <div className="flex flex-col">
                    <span key={time.s} className="text-4xl font-black digit-anim">{time.s}</span>
                    <span className="text-[10px] uppercase font-bold opacity-40">Seconds</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 space-y-8">
                <div className="ink-border p-6 bg-white/10 italic xerox-shadow card-hover">
                  <span className="text-[9px] font-bold uppercase block mb-1 opacity-40">Personal Best</span>
                  <p className="text-4xl font-black">{longestStreak} Days</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-6 bg-[#1a1a1a] text-[#f4f1ea] font-bold uppercase text-xs tracking-[.4em] xerox-shadow tap-active transition-all"
                  >
                    Reset the Tape
                  </button>
                  <div className="text-[9px] uppercase leading-loose font-bold p-4 text-center border-2 border-[#1a1a1a] opacity-40 italic">
                    "The void consumes everything but the will."
                  </div>
                </div>

                <div className="h-24 border-2 border-[#1a1a1a] bg-[repeating-linear-gradient(45deg,#1a1a1a,#1a1a1a_1px,transparent_1px,transparent_12px)] opacity-5"></div>
              </div>
            </div>
          </div>

          {/* History View */}
          <div className={`view-transition ${view === 'history' ? 'view-visible' : 'view-hidden'}`}>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-black uppercase mb-8 pb-2 border-b-4 border-[#1a1a1a] italic">Archive</h2>
              <div className="divide-y-2 divide-[#1a1a1a]">
                {history.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-[#1a1a1a]/20">
                    <p className="uppercase text-[10px] font-bold tracking-widest opacity-30">Records Purged</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center py-6 px-4 group hover:bg-[#1a1a1a] hover:text-[#f4f1ea] transition-all duration-300 cursor-default"
                    >
                      <div>
                        <p className="text-[9px] font-mono opacity-40 group-hover:opacity-100 transition-opacity">SEQ_{idx.toString().padStart(3, '0')}</p>
                        <p className="text-xl font-black uppercase tracking-tight">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-5xl font-black italic tracking-tighter transform group-hover:scale-105 transition-transform duration-300">
                        {item.duration}D
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 border-t-2 border-[#1a1a1a] py-8 flex flex-col md:flex-row justify-between text-[8px] font-bold uppercase tracking-[.5em] opacity-20">
          <p>© {new Date().getFullYear()} THE VOID // NULL OPERATOR</p>
          <p>STAY VIGILANT // NO ESCAPE</p>
        </footer>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#1a1a1a]/80 backdrop-blur-md transition-opacity duration-300" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="bg-[#f4f1ea] border-[8px] border-[#1a1a1a] p-10 max-w-sm w-full relative z-[101] xerox-shadow modal-enter">
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 italic leading-none">Execute Reset?</h3>
            <p className="text-[10px] font-bold uppercase mb-8 leading-relaxed opacity-60 font-mono">
              [SYSTEM_MSG]: ARCHIVING DATA... <br/>
              [SYSTEM_MSG]: ZEROING REGISTERS...
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmRelapse} 
                className="py-4 bg-[#1a1a1a] text-[#f4f1ea] text-[10px] font-bold uppercase tracking-widest hover:bg-[#333] transition-all tap-active"
              >
                Accept Deletion
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#f4f1ea] transition-all tap-active"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

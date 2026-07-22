import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Dumbbell } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 md:p-8 text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-red-900 selection:text-white">
      <div className="flex items-center justify-center max-w-5xl w-full">
        {/* Outer Heavy-Duty Armor Phone Frame */}
        <div 
          id="phone-frame" 
          className="relative w-full max-w-[390px] h-screen md:h-[820px] bg-zinc-950 md:rounded-[44px] md:shadow-[0_0_80px_rgba(220,38,38,0.2)] md:border-[12px] md:border-zinc-850 ring-1 ring-zinc-700/60 flex flex-col overflow-hidden transition-all duration-300"
        >
          {/* Top Speaker Notch / Status Accent Bar */}
          <div className="hidden md:flex items-center justify-between px-8 pt-3 pb-1 bg-zinc-950 border-b border-zinc-850 shrink-0 select-none">
            <span className="text-[9px] font-mono font-black tracking-widest text-zinc-500 uppercase">REPCHECK APP</span>
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full border border-zinc-700/50" />
            <span className="text-[9px] font-mono font-black text-red-500/80">ONLINE</span>
          </div>

          {/* Dynamic Screen Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950 relative">
            {children}
          </div>
        </div>

        {/* Side Info for Desktop View */}
        <div className="hidden lg:flex flex-col ml-12 max-w-xs text-left select-none animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600/10 border-2 border-red-600/30 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 w-fit shadow-lg shadow-red-600/10">
            <Dumbbell className="w-4 h-4 text-red-500 stroke-[2.5]" />
            GYM COMMUNITY
          </div>
          <h3 className="text-4xl font-black tracking-tight mb-2 text-white font-display leading-none uppercase">
            REP<span className="text-red-600">CHECK</span>
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-medium border-l-2 border-red-600/60 pl-3">
            Workout verification, certified gym photo logs, custom squad chat channels, and consistency streaks.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3 bg-zinc-900/80 p-3 rounded-2xl border-2 border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-md shrink-0 shadow-sm">
                ⚡
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Workout Streak Engine</p>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal">Keeps burning daily. Resets only after 3 consecutive rest days without a log.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/80 p-3 rounded-2xl border-2 border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700/80 flex items-center justify-center text-md shrink-0 shadow-sm">
                📸
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Photo Proof Logs</p>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal">Requires a gym snapshot to verify daily reps and consistency.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-zinc-900/80 p-3 rounded-2xl border-2 border-zinc-800">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700/80 flex items-center justify-center text-md shrink-0 shadow-sm">
                👊
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Direct Squad Rooms</p>
                <p className="text-[10px] text-zinc-400 font-medium leading-normal">Assemble private channels with your added lifters to sync routines.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t-2 border-zinc-800 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
            <span>REPCHECK v4.2</span>
            <span className="text-red-500/80 font-black">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

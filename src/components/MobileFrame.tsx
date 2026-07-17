import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Dumbbell } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 md:p-8 text-neutral-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      <div className="flex items-center justify-center max-w-5xl w-full">
        {/* Outer Phone Blueprint Frame */}
        <div 
          id="phone-frame" 
          className="relative w-full max-w-[390px] h-screen md:h-[820px] bg-[#0d0d0d] md:rounded-[48px] md:shadow-[0_0_80px_rgba(0,0,0,0.9)] md:border-[8px] md:border-[#222222] flex flex-col overflow-hidden transition-all duration-300"
        >
          {/* Dynamic Screen Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d0d]">
            {children}
          </div>
        </div>

        {/* Side Info for Desktop View */}
        <div className="hidden lg:flex flex-col ml-12 max-w-xs text-left select-none animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-4 w-fit">
            <Dumbbell className="w-3.5 h-3.5" />
            SQUAD FEED LIVE
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter mb-4 text-emerald-400 leading-none">
            GYM SOCIAL SYSTEM.
          </h3>
          <p className="text-neutral-400 text-xs leading-relaxed mb-6">
            Log dual-camera lift snapshots, record high-protein fuel meals, track streaks, and support buddies in real-time.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-md shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-200">LIFTING STREAK</p>
                <p className="text-[10px] text-neutral-500">Maintain daily workout checks. Log Rest Days safely to keep streaks alive.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-md shrink-0">
                🥗
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-200">FUEL DIETS</p>
                <p className="text-[10px] text-neutral-500">Record anabolic feasting calorie weights and clean recovery shakes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-md shrink-0">
                👊
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-200">BUDDY GROUPS</p>
                <p className="text-[10px] text-neutral-500">Join chat groups and comment with teammates for mutual motivation.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-900 text-[10px] font-mono text-neutral-650">
            GYMSOCIAL v2.0 // DE-THEMED & MINIMALIST
          </div>
        </div>
      </div>
    </div>
  );
}

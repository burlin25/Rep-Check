import React, { useState } from 'react';
import { Dumbbell, ArrowRight, ShieldCheck, User, Lock, Mail, Check, LogIn, UserPlus, Sparkles, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface AuthViewProps {
  allAccounts: UserProfile[];
  onSelectAccount: (acc: UserProfile) => void;
  onRegisterAccount: (newAcc: UserProfile) => void;
}

const AVATAR_PALETTE = [
  { name: 'Crimson Red', colors: 'bg-red-600 text-white shadow-sm font-black' },
  { name: 'Flame Ruby', colors: 'bg-rose-600 text-white shadow-sm font-black' },
  { name: 'Steel Amber', colors: 'bg-amber-500 text-slate-950 shadow-sm font-black' },
  { name: 'Mint Glow', colors: 'bg-emerald-500 text-white shadow-sm font-black' },
  { name: 'Iron Violet', colors: 'bg-indigo-600 text-white shadow-sm font-black' },
];

const LIFTING_GOALS = [
  { id: 'hypertrophy', label: 'Muscle Building & Mass', desc: 'Focus on hypertrophy, sets & reps' },
  { id: 'powerlifting', label: 'Raw Strength & PRs', desc: 'Max 1RM compound barbell lifts' },
  { id: 'conditioning', label: 'Athletic Conditioning', desc: 'Endurance, stamina & leanness' },
];

const EXPERIENCE_LEVELS = [
  { id: 'rookie', label: 'Rookie Lifter (0-1 yrs)', badge: 'NOVICE' },
  { id: 'intermediate', label: 'Intermediate Iron Addict (1-3 yrs)', badge: 'PRO' },
  { id: 'veteran', label: 'Veteran Heavyweight (3+ yrs)', badge: 'ELITE' },
];

export default function AuthView({ allAccounts, onSelectAccount, onRegisterAccount }: AuthViewProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form States
  const [signinIdentifier, setSigninIdentifier] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signinError, setSigninError] = useState<string | null>(null);

  // Sign Up Flow States (Questions ONLY happen during signup)
  const [signupStep, setSignupStep] = useState<'credentials' | 'name' | 'handle' | 'goal' | 'experience' | 'avatar'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState(LIFTING_GOALS[0].label);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[1].label);
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(AVATAR_PALETTE[0].colors);
  const [signupError, setSignupError] = useState<string | null>(null);

  const slideVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15 } }
  };

  // --- SIGN IN HANDLER ---
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = signinIdentifier.trim().toLowerCase();
    if (!query) {
      setSigninError("Please enter your handle or email.");
      return;
    }

    const cleanQuery = query.startsWith('@') ? query : `@${query}`;
    
    // Find matching account by handle, email or name
    const found = allAccounts.find(acc => 
      acc.handle.toLowerCase() === cleanQuery || 
      acc.handle.toLowerCase() === query || 
      (acc.email && acc.email.toLowerCase() === query) ||
      acc.name.toLowerCase() === query
    );

    if (found) {
      setSigninError(null);
      // Directly log in to saved account! NO onboarding questions!
      onSelectAccount(found);
    } else {
      setSigninError(`No account found for "${signinIdentifier}". Please check your handle or sign up.`);
    }
  };

  // Direct 1-tap login for existing accounts on device
  const handleQuickLogin = (acc: UserProfile) => {
    onSelectAccount(acc);
  };

  // --- SIGN UP STEPS HANDLERS ---
  const handleCredentialsContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setSignupError("Please enter both email and a secure password.");
      return;
    }
    setSignupError(null);
    setSignupStep('name'); // Proceed to beginning questions
  };

  const handleNameContinue = () => {
    if (!name.trim()) {
      setSignupError("Please enter your display name.");
      return;
    }
    setSignupError(null);
    setSignupStep('handle');
  };

  const handleHandleContinue = () => {
    const trimmed = handle.trim();
    if (!trimmed) {
      setSignupError("Please choose a gym handle.");
      return;
    }
    const cleanHandle = trimmed.startsWith('@') ? trimmed.toLowerCase() : `@${trimmed.toLowerCase()}`;
    const handleInUse = allAccounts.some(acc => acc.handle.toLowerCase() === cleanHandle);
    if (handleInUse) {
      setSignupError(`Handle ${cleanHandle} is taken. Try another!`);
      return;
    }
    setSignupError(null);
    setSignupStep('goal');
  };

  const handleFinalRegister = () => {
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim().toLowerCase() : `@${handle.trim().toLowerCase()}`;
    const newAcc: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      email: email.trim().toLowerCase(),
      password: password.trim(),
      avatarColor: selectedAvatarColor,
      streak: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      primaryGoal,
      experienceLevel
    };

    onRegisterAccount(newAcc);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-zinc-950 text-zinc-100 overflow-y-auto no-scrollbar px-5 py-6 select-none font-sans relative">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        
        {/* APP BRANDING HEADER */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center mx-auto shadow-xl shadow-red-600/30 border-2 border-red-500/40">
            <Dumbbell className="w-8 h-8 text-white stroke-[2.8]" />
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[9px] font-mono font-black uppercase text-red-500 bg-red-600/15 border border-red-600/30 px-2.5 py-0.5 rounded-md tracking-widest">
                VERIFIED GYM PROOF
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white font-display uppercase mt-1">
              REPCHECK
            </h1>
            <p className="text-xs text-zinc-400 font-bold max-w-xs mx-auto leading-relaxed mt-1">
              Share certified gym photo check-ins, track streaks, & chat with your gym partners.
            </p>
          </div>
        </div>

        {/* AUTHENTICATION TAB CONTROLS (SIGN IN vs SIGN UP) */}
        <div className="bg-zinc-900/90 p-1.5 rounded-2xl border-2 border-zinc-800 flex gap-1 shadow-inner">
          <button
            onClick={() => {
              setMode('signin');
              setSigninError(null);
            }}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signin'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4 stroke-[2.5]" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setMode('signup');
              setSignupStep('credentials');
              setSignupError(null);
            }}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signup'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* TAB BODY CONTENTS */}
        <AnimatePresence mode="wait">
          
          {/* 1. SIGN IN MODE (Direct login into current account, NO onboarding questions) */}
          {mode === 'signin' && (
            <motion.div
              key="signin"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5"
            >
              <form onSubmit={handleSignInSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">
                    Handle or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 stroke-[2.5]" />
                    <input
                      type="text"
                      required
                      placeholder="@squatking or email..."
                      value={signinIdentifier}
                      onChange={(e) => setSigninIdentifier(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">
                    Account Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 stroke-[2.5]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signinPassword}
                      onChange={(e) => setSigninPassword(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 transition shadow-sm"
                    />
                  </div>
                </div>

                {signinError && (
                  <div className="p-3 bg-rose-600/15 border-2 border-rose-600/30 rounded-xl text-xs text-rose-400 font-bold text-center">
                    ⚠️ {signinError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In To Account</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>

              {/* QUICK LOGIN CARDS (1-Tap login to saved accounts) */}
              {allAccounts.length > 0 && (
                <div className="pt-3 border-t-2 border-zinc-850 space-y-2 text-left">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
                      Saved Lifter Cards ({allAccounts.length})
                    </span>
                    <span className="text-[9px] text-red-400 font-bold font-mono">1-TAP LOGIN</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2">
                    {allAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => handleQuickLogin(acc)}
                        className="bg-zinc-900 hover:bg-zinc-850 p-3 rounded-2xl border-2 border-zinc-800 flex items-center justify-between cursor-pointer transition active:scale-95 group shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${acc.avatarColor} flex items-center justify-center font-black text-sm text-white shadow-sm border border-zinc-700`}>
                            {acc.name ? acc.name[0].toUpperCase() : 'U'}
                          </div>
                          <div className="leading-tight">
                            <h4 className="text-xs font-black text-white group-hover:text-red-400 transition">
                              {acc.name}
                            </h4>
                            <p className="text-[10px] text-zinc-400 font-mono font-bold">{acc.handle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-red-400 font-black font-mono bg-red-600/10 px-2 py-0.5 rounded-lg border border-red-600/20">
                            🔥 {acc.streak}d streak
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. SIGN UP MODE (Goes through beginning setup questions ONLY during signup) */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 text-left"
            >
              {/* STEP 1: CREDENTIALS */}
              {signupStep === 'credentials' && (
                <form onSubmit={handleCredentialsContinue} className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      STEP 1 OF 6 • ACCOUNT SETUP
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">Create Credentials</h2>
                    <p className="text-xs text-zinc-400 font-medium">Enter your email and password to secure your gym streak log.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 stroke-[2.5]" />
                        <input
                          type="email"
                          required
                          placeholder="lifter@repcheck.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 transition shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">Password</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500 stroke-[2.5]" />
                        <input
                          type="password"
                          required
                          placeholder="Create strong password..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 pl-10 pr-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 transition shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {signupError && <p className="text-xs text-rose-500 font-black text-center">{signupError}</p>}

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Start Onboarding Questions ➔</span>
                  </button>
                </form>
              )}

              {/* STEP 2: DISPLAY NAME QUESTION */}
              {signupStep === 'name' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      QUESTION 1 OF 5 • DISPLAY NAME
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">What's your name?</h2>
                    <p className="text-xs text-zinc-400 font-medium">Your squad members will identify you by this name.</p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brad Liftmaster"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 px-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 shadow-sm"
                    />
                    {signupError && <p className="text-xs text-rose-500 font-black">{signupError}</p>}
                  </div>

                  <button
                    onClick={handleNameContinue}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs transition shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer"
                  >
                    Next Question 👊
                  </button>
                </div>
              )}

              {/* STEP 3: UNIQUE GYM HANDLE QUESTION */}
              {signupStep === 'handle' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      QUESTION 2 OF 5 • GYM HANDLE
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">Choose your handle</h2>
                    <p className="text-xs text-zinc-400 font-medium">Your unique handle used for tag mentions and squad invites.</p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. @squatking"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl py-3.5 px-4 outline-none font-bold text-white placeholder-zinc-500 text-sm focus:border-red-600 shadow-sm"
                    />
                    {signupError && <p className="text-xs text-rose-500 font-black">{signupError}</p>}
                  </div>

                  <button
                    onClick={handleHandleContinue}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs transition shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer"
                  >
                    Lock Handle ⚡
                  </button>
                </div>
              )}

              {/* STEP 4: PRIMARY LIFTING GOAL QUESTION */}
              {signupStep === 'goal' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      QUESTION 3 OF 5 • LIFTING MISSION
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">Primary Gym Goal</h2>
                    <p className="text-xs text-zinc-400 font-medium">What is your primary focus in the gym?</p>
                  </div>

                  <div className="space-y-2">
                    {LIFTING_GOALS.map((g) => {
                      const isSelected = primaryGoal === g.label;
                      return (
                        <div
                          key={g.id}
                          onClick={() => setPrimaryGoal(g.label)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition text-left flex items-center justify-between ${
                            isSelected
                              ? 'bg-red-600/15 border-red-600 text-white shadow-md'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black uppercase tracking-wider">{g.label}</h4>
                            <p className="text-[10px] text-zinc-400 font-medium">{g.desc}</p>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-red-500 stroke-[3]" />}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSignupStep('experience')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs transition shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer"
                  >
                    Continue ➔
                  </button>
                </div>
              )}

              {/* STEP 5: EXPERIENCE LEVEL QUESTION */}
              {signupStep === 'experience' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      QUESTION 4 OF 5 • EXPERIENCE
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">Lifter Tier Level</h2>
                    <p className="text-xs text-zinc-400 font-medium">Select your current training experience level.</p>
                  </div>

                  <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((exp) => {
                      const isSelected = experienceLevel === exp.label;
                      return (
                        <div
                          key={exp.id}
                          onClick={() => setExperienceLevel(exp.label)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition text-left flex items-center justify-between ${
                            isSelected
                              ? 'bg-red-600/15 border-red-600 text-white shadow-md'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            <span className="text-[9px] font-mono font-black text-red-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 uppercase">
                              {exp.badge}
                            </span>
                            <h4 className="text-xs font-black uppercase tracking-wider mt-1">{exp.label}</h4>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-red-500 stroke-[3]" />}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSignupStep('avatar')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs transition shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer"
                  >
                    Final Step ➔
                  </button>
                </div>
              )}

              {/* STEP 6: SIGNATURE AVATAR LOOK */}
              {signupStep === 'avatar' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-black text-red-500 uppercase tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">
                      QUESTION 5 OF 5 • VISUAL BADGE
                    </span>
                    <h2 className="text-xl font-black font-display text-white uppercase tracking-tight">Signature Color</h2>
                    <p className="text-xs text-zinc-400 font-medium">Choose your signature lifter avatar badge styling.</p>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_PALETTE.map((swatch) => {
                      const isSelected = selectedAvatarColor === swatch.colors;
                      return (
                        <button
                          key={swatch.name}
                          onClick={() => setSelectedAvatarColor(swatch.colors)}
                          className={`h-12 rounded-2xl ${swatch.colors} flex items-center justify-center border-2 transition active:scale-95 cursor-pointer ${
                            isSelected ? 'border-red-500 scale-105 shadow-md' : 'border-zinc-800 opacity-60'
                          }`}
                          title={swatch.name}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3] text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleFinalRegister}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs transition shadow-lg shadow-red-600/30 border-2 border-red-500/40 bubble-hover cursor-pointer"
                  >
                    Complete Sign Up & Launch RepCheck! 🚀
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}

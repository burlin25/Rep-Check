import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Plus, Dumbbell, ArrowRight, Check } from 'lucide-react';
import MobileFrame from './components/MobileFrame';
import MessagesTab from './components/MessagesTab';
import ProfileTab from './components/ProfileTab';
import PostModal from './components/PostModal';
import { motion, AnimatePresence } from 'motion/react';

import { 
  GymBuddy, 
  WorkoutPost, 
  PersonalPR, 
  UserProfile
} from './types';

import { 
  INITIAL_BUDDIES, 
  INITIAL_POSTS, 
  INITIAL_PRS
} from './initialData';

// Bubbly, friendly avatar palette
const AVATAR_PALETTE = [
  { name: 'Sunny Lime', colors: 'bg-emerald-400 text-neutral-950 font-black ring-4 ring-emerald-500/10' },
  { name: 'Peach Crush', colors: 'bg-rose-400 text-neutral-950 font-black ring-4 ring-rose-500/10' },
  { name: 'Cotton Candy', colors: 'bg-pink-400 text-neutral-950 font-black ring-4 ring-pink-500/10' },
  { name: 'Sky Spark', colors: 'bg-cyan-400 text-neutral-950 font-black ring-4 ring-cyan-500/10' },
  { name: 'Cream Honey', colors: 'bg-amber-400 text-neutral-950 font-black ring-4 ring-amber-500/10' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('repcheck_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [allAccounts, setAllAccounts] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('repcheck_all_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('repcheck_all_accounts', JSON.stringify(allAccounts));
  }, [allAccounts]);

  const handleRegisterAccount = (name: string, handle: string, colors: string, streak: number) => {
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim().toLowerCase() : `@${handle.trim().toLowerCase()}`;
    const newAcc: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      avatarColor: colors,
      streak: streak,
      joinedDate: 'June 2026'
    };

    setAllAccounts(prev => {
      const filtered = prev.filter(a => a.handle !== cleanHandle);
      return [...filtered, newAcc];
    });

    setCurrentUser(newAcc);
    localStorage.setItem('repcheck_current_user', JSON.stringify(newAcc));

    // Clear and initialize local databases for this new user
    localStorage.setItem(`gymsocial_lifting_streak_${newAcc.id}`, String(streak));
    localStorage.setItem(`gymsocial_posts_${newAcc.id}`, JSON.stringify(INITIAL_POSTS));
    localStorage.setItem(`gymsocial_buddies_${newAcc.id}`, JSON.stringify(INITIAL_BUDDIES));
    localStorage.setItem(`gymsocial_prs_${newAcc.id}`, JSON.stringify(INITIAL_PRS));
  };

  const handleSwitchAccount = (account: UserProfile) => {
    setCurrentUser(account);
    localStorage.setItem('repcheck_current_user', JSON.stringify(account));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('repcheck_current_user');
  };

  if (!currentUser) {
    return (
      <OnboardingView 
        allAccounts={allAccounts} 
        onSelectAccount={handleSwitchAccount} 
        onRegister={handleRegisterAccount} 
      />
    );
  }

  return (
    <AppInner 
      key={currentUser.id} 
      currentUser={currentUser} 
      onLogout={handleLogout} 
    />
  );
}

// --- ONBOARDING SECTOR ---
interface OnboardingProps {
  allAccounts: UserProfile[];
  onSelectAccount: (acc: UserProfile) => void;
  onRegister: (name: string, handle: string, colors: string, streak: number) => void;
}

function OnboardingView({ allAccounts, onSelectAccount, onRegister }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'name' | 'handle' | 'streak' | 'avatar'>(() => {
    return allAccounts.length > 0 ? 'welcome' : 'name';
  });

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(AVATAR_PALETTE[0].colors);
  const [startingStreak, setStartingStreak] = useState<number>(3);
  const [regError, setRegError] = useState<string | null>(null);

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const handleNameContinue = () => {
    if (!name.trim()) {
      setRegError("Please enter your display name.");
      return;
    }
    setRegError(null);
    setStep('handle');
  };

  const handleHandleContinue = () => {
    const trimmed = handle.trim();
    if (!trimmed) {
      setRegError("Please choose a profile handle.");
      return;
    }
    const cleanHandle = trimmed.startsWith('@') ? trimmed.toLowerCase() : `@${trimmed.toLowerCase()}`;
    const handleInUse = allAccounts.some(acc => acc.handle === cleanHandle);
    if (handleInUse) {
      setRegError(`The handle ${cleanHandle} is already registered!`);
      return;
    }
    setRegError(null);
    setStep('streak');
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col justify-between bg-[#0e0c15] text-neutral-100 overflow-y-auto no-scrollbar px-6 py-8 select-none font-sans relative">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          
          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div 
                key="welcome"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6 py-4 text-center"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <Dumbbell className="w-8 h-8 text-neutral-950 stroke-[2.5]" />
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-white font-display leading-tight uppercase">
                      RepCheck
                    </h1>
                    <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                      Welcome to the friendliest, most basic gym social network ever! 👊
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <button
                    onClick={() => setStep('name')}
                    className="w-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition shadow-md bubble-hover cursor-pointer"
                  >
                    Create New Account 🚀
                  </button>

                  {allAccounts.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-purple-950/30">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 text-left mb-2">
                        Select Existing Account
                      </span>
                      <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2">
                        {allAccounts.map(acc => (
                          <div 
                            key={acc.id}
                            onClick={() => onSelectAccount(acc)}
                            className="bg-[#191624] hover:bg-[#201c2e] p-3 rounded-2xl border border-purple-950/20 flex items-center justify-between cursor-pointer transition active:scale-95 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl ${acc.avatarColor} flex items-center justify-center font-black text-xs text-neutral-900`}>
                                {acc.name[0]}
                              </div>
                              <div className="leading-tight">
                                <h4 className="text-xs font-black text-white">{acc.name}</h4>
                                <p className="text-[10px] text-neutral-400 font-mono">{acc.handle}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-amber-400 font-black font-mono">🔥 {acc.streak}d</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'name' && (
              <motion.div 
                key="name"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-display text-white">What's your name?</h2>
                  <p className="text-xs text-neutral-400">Let's set up your premium profile name.</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coach Brad"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#191624] border-2 border-purple-950/30 rounded-2xl py-3 px-4 outline-none font-bold text-white placeholder-neutral-500 text-sm focus:border-emerald-400"
                  />
                  {regError && <p className="text-xs text-rose-400 font-medium">{regError}</p>}
                </div>

                <button
                  onClick={handleNameContinue}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition bubble-hover cursor-pointer"
                >
                  Continue 👊
                </button>
              </motion.div>
            )}

            {step === 'handle' && (
              <motion.div 
                key="handle"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-display text-white">Choose a handle</h2>
                  <p className="text-xs text-neutral-400">Your unique gym identifier.</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. @squatking"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-[#191624] border-2 border-purple-950/30 rounded-2xl py-3 px-4 outline-none font-bold text-white placeholder-neutral-500 text-sm focus:border-emerald-400"
                  />
                  {regError && <p className="text-xs text-rose-400 font-medium">{regError}</p>}
                </div>

                <button
                  onClick={handleHandleContinue}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition bubble-hover cursor-pointer"
                >
                  Confirm Handle ⚡
                </button>
              </motion.div>
            )}

            {step === 'streak' && (
              <motion.div 
                key="streak"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-display text-white">Current Streak</h2>
                  <p className="text-xs text-neutral-400">How many consecutive days did you workout/rest?</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#191624] p-4 rounded-2xl border border-purple-950/20 text-center">
                    <span className="text-3xl font-black text-amber-400 font-display">🔥 {startingStreak} Days</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {[0, 3, 5, 10, 15].map(v => (
                      <button
                        key={v}
                        onClick={() => setStartingStreak(v)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                          startingStreak === v 
                            ? 'bg-amber-400 text-neutral-950 border-amber-400' 
                            : 'bg-[#110e1a] text-neutral-400 border-purple-950/20 hover:text-white'
                        }`}
                      >
                        {v}d
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('avatar')}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition bubble-hover cursor-pointer"
                >
                  Continue 🚀
                </button>
              </motion.div>
            )}

            {step === 'avatar' && (
              <motion.div 
                key="avatar"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-display text-white">Signature look</h2>
                  <p className="text-xs text-neutral-400">Choose a friendly avatar theme.</p>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {AVATAR_PALETTE.map((swatch) => {
                    const isSelected = selectedAvatarColor === swatch.colors;
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setSelectedAvatarColor(swatch.colors)}
                        className={`h-11 rounded-2xl ${swatch.colors} flex items-center justify-center border-2 transition active:scale-95 cursor-pointer ${
                          isSelected ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-60'
                        }`}
                        title={swatch.name}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3] text-neutral-950" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => onRegister(name, handle, selectedAvatarColor, startingStreak)}
                  className="w-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition bubble-hover cursor-pointer"
                >
                  Get Started! 👊
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </MobileFrame>
  );
}

// --- CORE APP VIEW INNER ---
interface AppInnerProps {
  currentUser: UserProfile;
  onLogout: () => void;
  key?: string;
}

function AppInner({ currentUser, onLogout }: AppInnerProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'profile'>('messages');
  const [isPostOpen, setIsPostOpen] = useState(false);
  const userId = currentUser.id;

  // Sync state cleanly with localStorage prefix
  const [buddies, setBuddies] = useState<GymBuddy[]>(() => {
    try {
      const saved = localStorage.getItem(`gymsocial_buddies_${userId}`);
      return saved ? JSON.parse(saved) : INITIAL_BUDDIES;
    } catch {
      return INITIAL_BUDDIES;
    }
  });

  const [posts, setPosts] = useState<WorkoutPost[]>(() => {
    try {
      const saved = localStorage.getItem(`gymsocial_posts_${userId}`);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [prs, setPrs] = useState<PersonalPR[]>(() => {
    try {
      const saved = localStorage.getItem(`gymsocial_prs_${userId}`);
      return saved ? JSON.parse(saved) : INITIAL_PRS;
    } catch {
      return INITIAL_PRS;
    }
  });

  const [liftingStreak, setLiftingStreak] = useState<number>(() => {
    const saved = localStorage.getItem(`gymsocial_lifting_streak_${userId}`);
    return saved ? parseInt(saved) : currentUser.streak;
  });

  useEffect(() => {
    localStorage.setItem(`gymsocial_buddies_${userId}`, JSON.stringify(buddies));
  }, [buddies, userId]);

  useEffect(() => {
    localStorage.setItem(`gymsocial_posts_${userId}`, JSON.stringify(posts));
  }, [posts, userId]);

  useEffect(() => {
    localStorage.setItem(`gymsocial_prs_${userId}`, JSON.stringify(prs));
  }, [prs, userId]);

  useEffect(() => {
    localStorage.setItem(`gymsocial_lifting_streak_${userId}`, String(liftingStreak));
  }, [liftingStreak, userId]);

  const handlePostCreated = (newPost: WorkoutPost) => {
    setPosts(prev => [newPost, ...prev]);
    // Increment the active streak when posting a gym update!
    setLiftingStreak(prev => prev + 1);
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0b15]">
        
        {/* TAB RENDERING */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'messages' ? (
            <MessagesTab 
              buddies={buddies}
              posts={posts}
              setPosts={setPosts}
              currentUser={currentUser}
              liftingStreak={liftingStreak}
            />
          ) : (
            <ProfileTab 
              prs={prs}
              setPrs={setPrs}
              buddies={buddies}
              setBuddies={setBuddies}
              currentUser={currentUser}
              liftingStreak={liftingStreak}
              onLogout={onLogout}
            />
          )}
        </div>

        {/* BUBBLY TIKTOK STYLE BOTTOM NAVIGATION */}
        <div className="bg-[#14121d] border-t-2 border-purple-950/20 px-4 py-3.5 flex justify-between items-center z-40 select-none relative font-sans">
          
          {/* Left Button: Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-1.5 rounded-2xl transition duration-150 cursor-pointer ${
              activeTab === 'messages'
                ? 'text-emerald-400 font-black'
                : 'text-neutral-500 hover:text-neutral-350'
            }`}
          >
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] tracking-tight font-bold font-display uppercase">Messages</span>
          </button>

          {/* Center Button: Bouncing, popping TikTok post button */}
          <div className="relative px-4 flex justify-center flex-shrink-0">
            <button
              onClick={() => setIsPostOpen(true)}
              className="flex items-center justify-center -mt-9 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 w-14 h-14 rounded-full shadow-[0_5px_20px_rgba(52,211,153,0.3)] active:scale-90 transition border-4 border-[#0d0b15] z-50 cursor-pointer select-none bubble-hover"
              title="Post Gym Update"
            >
              <Plus className="w-7 h-7 stroke-[4]" />
            </button>
          </div>

          {/* Right Button: Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center gap-1.5 py-1.5 rounded-2xl transition duration-150 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-emerald-400 font-black'
                : 'text-neutral-500 hover:text-neutral-350'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] tracking-tight font-bold font-display uppercase">Profile</span>
          </button>

        </div>

        {/* FORCED CAPTION POST MODAL */}
        <PostModal 
          isOpen={isPostOpen}
          onClose={() => setIsPostOpen(false)}
          currentUser={currentUser}
          liftingStreak={liftingStreak}
          onPostCreated={handlePostCreated}
        />

      </div>
    </MobileFrame>
  );
}

import React, { useState } from 'react';
import { 
  User, 
  Trash2, 
  Plus, 
  X, 
  Flame, 
  Award, 
  UserPlus, 
  Check, 
  LogOut, 
  Dumbbell,
  Users,
  Sparkles,
  Trophy,
  Target,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { PersonalPR, GymBuddy, UserProfile } from '../types';
import { POPULAR_EXERCISES } from '../initialData';

interface ProfileTabProps {
  prs: PersonalPR[];
  setPrs: React.Dispatch<React.SetStateAction<PersonalPR[]>>;
  buddies: GymBuddy[];
  setBuddies: React.Dispatch<React.SetStateAction<GymBuddy[]>>;
  currentUser: UserProfile;
  liftingStreak: number;
  onLogout: () => void;
  onUpdateName?: (name: string, handle: string) => void;
}

export default function ProfileTab({
  prs,
  setPrs,
  buddies,
  setBuddies,
  currentUser,
  liftingStreak,
  onLogout,
  onUpdateName
}: ProfileTabProps) {
  // PR edit forms state
  const [isAddPrOpen, setIsAddPrOpen] = useState(false);
  const [prExercise, setPrExercise] = useState(POPULAR_EXERCISES[0] || 'Bench Press 🏋️‍♂️');
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('5');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editHandle, setEditHandle] = useState(currentUser.handle);

  // Search/Add Gym Bros state
  const [searchHandle, setSearchHandle] = useState('');
  const [searchName, setSearchName] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Pending Gym Bro Requests state (kept completely clean and empty as requested)
  const [pendingRequests, setPendingRequests] = useState<Array<{ id: string; name: string; handle: string; color: string }>>(() => {
    try {
      const saved = localStorage.getItem(`repcheck_pending_requests_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save/Accept / Decline / Add / Remove Handlers
  const handleAddPR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prWeight || isNaN(Number(prWeight))) return;

    const newPR: PersonalPR = {
      id: `pr-${Date.now()}`,
      exercise: prExercise,
      weight: parseFloat(prWeight),
      reps: parseInt(prReps) || 1,
      date: new Date().toISOString().split('T')[0]
    };

    setPrs(prev => {
      const filtered = prev.filter(p => p.exercise !== prExercise);
      return [newPR, ...filtered];
    });

    setPrWeight('');
    setPrReps('5');
    setIsAddPrOpen(false);
  };

  const handleDeletePR = (id: string) => {
    setPrs(prev => prev.filter(p => p.id !== id));
  };

  const handleAcceptRequest = (req: { id: string; name: string; handle: string; color: string }) => {
    const newBuddy: GymBuddy = {
      id: `buddy-${Date.now()}`,
      name: req.name,
      handle: req.handle,
      avatarColor: req.color,
      streak: Math.floor(Math.random() * 8) + 1,
      checkedInToday: true,
      isRestDay: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isCustom: true
    };

    setBuddies(prev => [...prev, newBuddy]);
    const remaining = pendingRequests.filter(r => r.id !== req.id);
    setPendingRequests(remaining);
    localStorage.setItem(`repcheck_pending_requests_${currentUser.id}`, JSON.stringify(remaining));
  };

  const handleDeclineRequest = (reqId: string) => {
    const remaining = pendingRequests.filter(r => r.id !== reqId);
    setPendingRequests(remaining);
    localStorage.setItem(`repcheck_pending_requests_${currentUser.id}`, JSON.stringify(remaining));
  };

  const handleAddGymBro = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!searchName.trim() || !searchHandle.trim()) {
      setAddError('Please enter both name and handle! 🤝');
      return;
    }

    const cleanHandle = searchHandle.trim().startsWith('@') 
      ? searchHandle.trim().toLowerCase() 
      : `@${searchHandle.trim().toLowerCase()}`;

    const isAlreadyFriend = buddies.some(b => b.handle === cleanHandle);
    if (isAlreadyFriend) {
      setAddError('Already gym bros with this lifter! 💪');
      return;
    }

    const colorClasses = [
      'bg-indigo-600 text-white',
      'bg-emerald-500 text-white',
      'bg-rose-500 text-white',
      'bg-amber-500 text-slate-900',
      'bg-teal-500 text-white',
      'bg-violet-500 text-white'
    ];
    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];

    const newBuddy: GymBuddy = {
      id: `buddy-${Date.now()}`,
      name: searchName.trim(),
      handle: cleanHandle,
      avatarColor: randomColor,
      streak: 0,
      checkedInToday: false,
      isRestDay: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isCustom: true
    };

    setBuddies(prev => [...prev, newBuddy]);
    setAddSuccess(`Connected with ${searchName.trim()}! 👊`);
    setSearchName('');
    setSearchHandle('');

    setTimeout(() => setAddSuccess(''), 4000);
  };

  const handleRemoveFriend = (id: string) => {
    setBuddies(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateName && editName.trim() && editHandle.trim()) {
      const cleanHandle = editHandle.trim().startsWith('@') ? editHandle.trim().toLowerCase() : `@${editHandle.trim().toLowerCase()}`;
      onUpdateName(editName.trim(), cleanHandle);
      setIsEditingProfile(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-20 bg-zinc-950 text-zinc-100 select-none font-sans">
      
      {/* Redesigned Immersive Header with Industrial Heavy-Duty Styling */}
      <div className="relative bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 text-white pt-10 pb-8 px-5 rounded-b-[2.5rem] shadow-xl overflow-hidden border-b-2 border-zinc-800">
        {/* Artistic background blur elements */}
        <div className="absolute top-[-10%] left-[-10%] w-52 h-52 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-44 h-44 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
        
        {/* Top Mini-Pill Header */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-red-600/15 text-red-400 border border-red-600/30 px-3 py-1 rounded-xl">
            LIFTER CARD • VERIFIED
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-black text-[10px] px-3 py-1.5 rounded-xl transition cursor-pointer border-2 border-zinc-800 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
            <span className="uppercase tracking-wider">Logout</span>
          </button>
        </div>

        {/* User Card Layout */}
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          {/* Avatar with heavy steel border ring */}
          <div className="relative">
            <div className="absolute inset-[-6px] rounded-[2.2rem] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 opacity-90 blur-[2px]" />
            <div className="absolute inset-[-4px] rounded-[2.1rem] bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500" />
            
            <div className={`w-20 h-20 rounded-[2rem] relative z-10 ${currentUser.avatarColor || 'bg-red-600 text-white'} flex items-center justify-center font-black text-3xl text-white shadow-2xl border-[4px] border-zinc-950`}>
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            
            {/* Tiny floating status indicator */}
            <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 bg-red-600 rounded-full border-4 border-zinc-950 flex items-center justify-center z-20 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          {/* Profile Name & Handles editing */}
          <div className="space-y-1.5 max-w-sm w-full">
            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="w-full max-w-xs mx-auto bg-zinc-900/90 p-3 rounded-2xl border-2 border-zinc-800 space-y-2.5">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-center bg-zinc-950 border-2 border-zinc-800 rounded-xl py-1.5 px-3 text-xs font-black outline-none text-white focus:border-red-600"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full text-center bg-zinc-950 border-2 border-zinc-800 rounded-xl py-1.5 px-3 text-xs font-mono outline-none text-red-400 focus:border-red-600 font-bold"
                  placeholder="Your Handle"
                  required
                />
                <div className="flex justify-center gap-1.5 pt-1">
                  <button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition border border-red-500/30"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)} 
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition border border-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="leading-tight">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-black font-display tracking-tight text-white uppercase drop-shadow-sm">
                    {currentUser.name}
                  </h2>
                  <button 
                    onClick={() => {
                      setEditName(currentUser.name);
                      setEditHandle(currentUser.handle);
                      setIsEditingProfile(true);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 text-[9px] font-black text-red-400 uppercase px-2.5 py-1 rounded-lg transition border-2 border-zinc-800 cursor-pointer shadow-xs"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-xs text-red-400 font-mono font-bold tracking-wide mt-1">{currentUser.handle}</p>
                
                {(currentUser.primaryGoal || currentUser.experienceLevel) && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                    {currentUser.experienceLevel && (
                      <span className="text-[9px] font-mono font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {currentUser.experienceLevel}
                      </span>
                    )}
                    {currentUser.primaryGoal && (
                      <span className="text-[9px] font-mono font-black uppercase text-red-400 bg-red-600/15 px-2 py-0.5 rounded-md border border-red-600/30">
                        {currentUser.primaryGoal}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Bento Stats Grid inside Header */}
        <div className="grid grid-cols-3 gap-3.5 mt-8 max-w-md mx-auto relative z-10">
          
          {/* Bento Stat 1: Consistency Streak */}
          <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center space-y-1 backdrop-blur-md shadow-md">
            <Flame className="w-5 h-5 text-red-500 animate-pulse stroke-[2.5]" />
            <div className="text-center leading-none">
              <span className="text-lg font-black font-display text-white">{liftingStreak}</span>
              <span className="block text-[8px] font-black font-mono text-red-500 uppercase tracking-widest mt-1">STREAK</span>
            </div>
          </div>

          {/* Bento Stat 2: Squad Connections */}
          <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center space-y-1 backdrop-blur-md shadow-md">
            <Users className="w-5 h-5 text-red-400 stroke-[2.5]" />
            <div className="text-center leading-none">
              <span className="text-lg font-black font-display text-white">{buddies.length}</span>
              <span className="block text-[8px] font-black font-mono text-red-400 uppercase tracking-widest mt-1">SQUAD</span>
            </div>
          </div>

          {/* Bento Stat 3: PR Count */}
          <div className="bg-zinc-900/90 border-2 border-zinc-800 p-3.5 rounded-2xl flex flex-col items-center justify-center space-y-1 backdrop-blur-md shadow-md">
            <Trophy className="w-5 h-5 text-red-500 stroke-[2.5]" />
            <div className="text-center leading-none">
              <span className="text-lg font-black font-display text-white">{prs.length}</span>
              <span className="block text-[8px] font-black font-mono text-red-500 uppercase tracking-widest mt-1">PR RECORDS</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Space with Colorful Blocks and Bento Sections */}
      <div className="p-4 space-y-5">

        {/* SECTION A: HEAVY TROPHY LIFT GALLERY */}
        <div className="bg-zinc-900 rounded-3xl border-2 border-zinc-800 p-5 shadow-md space-y-4">
          <div className="flex justify-between items-center text-left">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7.5 h-7.5 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md border border-red-500/40">
                  <Trophy className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">PR Record Trophy Plates</h3>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold">Verify your high-water mark records across major barbell lifts.</p>
            </div>
            <button
              onClick={() => setIsAddPrOpen(true)}
              className="flex items-center gap-1.5 bg-red-600/15 hover:bg-red-600/25 px-4 py-2 rounded-2xl text-xs font-black text-red-400 transition duration-150 cursor-pointer active:scale-95 border-2 border-red-600/30 uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Adjust</span>
            </button>
          </div>

          {prs.length === 0 ? (
            <div className="bg-zinc-950 py-7 px-4 text-center rounded-2xl text-xs text-zinc-400 font-bold border-2 border-zinc-800 space-y-2">
              <Dumbbell className="w-7 h-7 text-zinc-600 mx-auto" />
              <p>No Personal Records logged yet. Tap "Adjust" to display your raw power milestones! 🏋️‍♂️</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {prs.map((pr) => (
                <div 
                  key={pr.id}
                  className="bg-zinc-950 p-3 rounded-2xl border-2 border-zinc-800 flex flex-col justify-between text-left relative group transition hover:border-red-600/50 overflow-hidden shadow-inner"
                >
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleDeletePR(pr.id)}
                      className="p-1 hover:bg-rose-600/20 text-zinc-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Delete PR"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 pr-6">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-red-500 font-mono">Verified Lift</span>
                    <h4 className="text-xs font-black text-white leading-tight truncate uppercase">{pr.exercise}</h4>
                  </div>

                  <div className="mt-3.5 flex items-baseline justify-between pt-1 border-t-2 border-zinc-850">
                    <div className="leading-tight">
                      <span className="text-base font-black text-white font-display">{pr.weight}</span>
                      <span className="text-[9px] font-bold text-zinc-400 ml-0.5">lbs</span>
                    </div>
                    <span className="text-[10px] font-black text-red-400 bg-red-600/15 border border-red-600/30 px-2 py-0.5 rounded-lg font-mono">
                      x{pr.reps} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION B: SQUAD CONNECT HUB */}
        <div className="bg-zinc-900 rounded-3xl border-2 border-zinc-800 p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-left">
            <div className="w-7.5 h-7.5 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md border border-red-500/40">
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">Connect Gym Bros</h3>
              <p className="text-[10px] text-zinc-400 font-bold">Link with partners in real-time to start custom chat groups and compare consistency.</p>
            </div>
          </div>

          {addError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] text-rose-400 text-center font-bold">
              ⚠️ {addError}
            </div>
          )}
          {addSuccess && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] text-red-400 text-center font-bold">
              ✨ {addSuccess}
            </div>
          )}

          <form onSubmit={handleAddGymBro} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider ml-1">Full Name</span>
                <input
                  type="text"
                  placeholder="e.g. David Laid"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 rounded-xl py-2.5 px-3 outline-none text-white placeholder-zinc-500 font-bold text-xs"
                />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider ml-1">Gym Handle</span>
                <input
                  type="text"
                  placeholder="e.g. @laid"
                  value={searchHandle}
                  onChange={(e) => setSearchHandle(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 rounded-xl py-2.5 px-3 outline-none text-white placeholder-zinc-500 font-bold text-xs font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl uppercase tracking-wider text-xs shadow-lg shadow-red-600/20 bubble-hover cursor-pointer"
            >
              Add Gym Bro 🤝
            </button>
          </form>

          {/* List of Connected Gym Bros */}
          <div className="pt-2 border-t border-zinc-800 space-y-3 text-left">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pl-1">
              Active Crew Members ({buddies.length})
            </span>

            {buddies.length === 0 ? (
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center py-6 text-xs text-zinc-500 font-semibold leading-relaxed">
                You don't have any gym bros added. Use the form above to add your custom lifters! 👊
              </div>
            ) : (
              <div className="space-y-2">
                {buddies.map((buddy) => (
                  <div 
                    key={buddy.id}
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between text-xs transition hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl ${buddy.avatarColor || 'bg-zinc-800 text-white'} flex items-center justify-center font-black text-xs`}>
                        {buddy.name ? buddy.name[0].toUpperCase() : 'B'}
                      </div>
                      <div className="leading-tight">
                        <span className="font-extrabold text-white block">{buddy.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">{buddy.handle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-red-400 font-black bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20 flex items-center gap-0.5">
                        <span>🔥</span>
                        <span>{buddy.streak}d</span>
                      </span>
                      <button
                        onClick={() => handleRemoveFriend(buddy.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-xl transition cursor-pointer"
                        title="Remove Friend"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION C: PENDING INCOMING INVITATIONS */}
        {pendingRequests.length > 0 && (
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs animate-pulse">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">Incoming Squad Invites ({pendingRequests.length})</h3>
            </div>

            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div 
                  key={req.id}
                  className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl ${req.color} flex items-center justify-center font-black text-xs shrink-0`}>
                      {req.name[0]}
                    </div>
                    <div className="text-left min-w-0 leading-tight">
                      <span className="font-extrabold text-white block truncate">{req.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono truncate block">{req.handle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-xl font-bold transition bubble-hover cursor-pointer"
                      title="Accept Bro Request"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 p-1.5 rounded-xl font-bold transition cursor-pointer"
                      title="Decline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ADJUST PR LIFT MODAL */}
      {isAddPrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl relative text-zinc-100">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-black font-display text-white uppercase">Adjust Personal Record</h3>
              <button
                onClick={() => setIsAddPrOpen(false)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPR} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wide mb-1 text-left pl-1">Select Lift / Exercise</label>
                <select
                  value={prExercise}
                  onChange={(e) => setPrExercise(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-2.5 px-2 outline-none font-bold text-white cursor-pointer focus:border-red-600"
                >
                  {POPULAR_EXERCISES.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wide mb-1 text-left pl-1">Weight (lbs)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={1000}
                    placeholder="e.g. 225"
                    value={prWeight}
                    onChange={(e) => setPrWeight(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-2 px-3 outline-none text-white font-bold focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wide mb-1 text-left pl-1">Max Reps</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={prReps}
                    onChange={(e) => setPrReps(e.target.value)}
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl py-2 px-3 outline-none text-white font-bold focus:border-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase tracking-wider text-[10px] bubble-hover cursor-pointer shadow-lg shadow-red-600/20"
              >
                Record PR Lift 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

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
  ChevronRight, 
  Dumbbell,
  Users
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
}

export default function ProfileTab({
  prs,
  setPrs,
  buddies,
  setBuddies,
  currentUser,
  liftingStreak,
  onLogout
}: ProfileTabProps) {
  // PR edit forms state
  const [isAddPrOpen, setIsAddPrOpen] = useState(false);
  const [prExercise, setPrExercise] = useState(POPULAR_EXERCISES[0]);
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('5');

  // Search/Add Gym Bros state
  const [searchHandle, setSearchHandle] = useState('');
  const [searchName, setSearchName] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Pending Gym Bro Requests state (mocking some realistic incoming invitations)
  const [pendingRequests, setPendingRequests] = useState<Array<{ id: string; name: string; handle: string; color: string }>>(() => {
    const saved = localStorage.getItem(`repcheck_pending_requests_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    // Default initial pending requests for premium active feel!
    return [
      { id: 'req1', name: 'Zane Liftwell', handle: '@zane_lifts', color: 'bg-rose-500 text-white' },
      { id: 'req2', name: 'Clara Power', handle: '@clara_squats', color: 'bg-amber-500 text-neutral-900' }
    ];
  });

  // Sync pending requests
  const savePendingRequests = (reqs: typeof pendingRequests) => {
    setPendingRequests(reqs);
    localStorage.setItem(`repcheck_pending_requests_${currentUser.id}`, JSON.stringify(reqs));
  };

  // --- SAVE PR LIFT ---
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
      // If there's an existing PR for this exercise, we can replace or keep both
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

  // --- ACCEPT GYM BRO REQUEST ---
  const handleAcceptRequest = (req: { id: string; name: string; handle: string; color: string }) => {
    const newBuddy: GymBuddy = {
      id: `buddy-${Date.now()}`,
      name: req.name,
      handle: req.handle,
      avatarColor: req.color,
      streak: Math.floor(Math.random() * 15) + 3, // random initial streak for simulation
      checkedInToday: true,
      isRestDay: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isCustom: true
    };

    // Add to buddies list
    setBuddies(prev => [...prev, newBuddy]);
    // Clear from pending requests
    const remaining = pendingRequests.filter(r => r.id !== req.id);
    savePendingRequests(remaining);
  };

  const handleDeclineRequest = (reqId: string) => {
    const remaining = pendingRequests.filter(r => r.id !== reqId);
    savePendingRequests(remaining);
  };

  // --- ADD / SEARCH GYM BROS ---
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

    // Check if already friends
    const isAlreadyFriend = buddies.some(b => b.handle === cleanHandle);
    if (isAlreadyFriend) {
      setAddError('You are already gym bros with this lifter! 💪');
      return;
    }

    // Add directly as pending invited, or simulate addition!
    const newBuddy: GymBuddy = {
      id: `buddy-${Date.now()}`,
      name: searchName.trim(),
      handle: cleanHandle,
      avatarColor: 'bg-purple-500 text-white',
      streak: 0,
      checkedInToday: false,
      isRestDay: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isCustom: true
    };

    setBuddies(prev => [...prev, newBuddy]);
    setAddSuccess(`Sent! ${searchName.trim()} has been added to your Gym Bros! 👊`);
    setSearchName('');
    setSearchHandle('');

    setTimeout(() => setAddSuccess(''), 4000);
  };

  // --- REMOVE FRIEND ---
  const handleRemoveFriend = (id: string) => {
    setBuddies(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-20 bg-[#0d0b15] text-neutral-100 select-none font-sans p-4 space-y-4">
      
      {/* 1. TOP AVATAR IDENTIFIER */}
      <div className="bg-[#191624] p-5 rounded-3xl border border-purple-950/30 text-center space-y-3 shadow-md relative overflow-hidden">
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-black font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            MEMBER
          </span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className={`w-16 h-16 rounded-3xl ${currentUser.avatarColor} flex items-center justify-center font-black text-2xl text-neutral-900 shadow-lg`}>
            {currentUser.name[0]}
          </div>
          <div className="leading-tight">
            <h2 className="text-xl font-black font-display text-white tracking-tight">{currentUser.name}</h2>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">{currentUser.handle}</p>
          </div>
        </div>

        {/* Big Bubbly Streak Badge */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 bg-[#110e1a] px-4 py-2 rounded-2xl border border-purple-950/30 text-xs font-black">
            <span className="text-base">🔥</span>
            <span>{liftingStreak} DAYS ACTIVE STREAK</span>
          </div>
        </div>
      </div>

      {/* 2. PERSONAL RECORDS (PRS) ADJUSTMENT SECTOR */}
      <div className="bg-[#191624] p-4.5 rounded-3xl border border-purple-950/30 space-y-3.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">Your Personal Records</h3>
          </div>
          <button
            onClick={() => setIsAddPrOpen(true)}
            className="flex items-center gap-1 bg-[#110e1a] hover:bg-emerald-500 hover:text-neutral-950 px-3 py-1.5 rounded-full text-xs font-black text-emerald-400 transition duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adjust</span>
          </button>
        </div>

        {prs.length === 0 ? (
          <div className="bg-[#110e1a] py-6 px-4 text-center rounded-2xl text-xs text-neutral-400 font-semibold border border-purple-950/10">
            No PR lifts logged. Hit "Adjust" to add one! 🏋️‍♂️
          </div>
        ) : (
          <div className="space-y-2">
            {prs.map((pr) => (
              <div 
                key={pr.id}
                className="bg-[#110e1a] p-3 rounded-2xl border border-purple-950/20 flex justify-between items-center text-xs group transition hover:border-purple-500/20"
              >
                <div className="text-left leading-tight">
                  <span className="font-extrabold text-white block">{pr.exercise}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Last hit: {pr.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-400 font-black">
                    {pr.weight} lbs x {pr.reps} reps
                  </span>
                  <button
                    onClick={() => handleDeletePR(pr.id)}
                    className="p-1 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                    title="Delete PR"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PENDING GYM BRO REQUESTS SECTION */}
      {pendingRequests.length > 0 && (
        <div className="bg-[#191624] p-4.5 rounded-3xl border border-purple-950/30 space-y-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">Gym Bro Invitations ({pendingRequests.length})</h3>
          </div>

          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div 
                key={req.id}
                className="bg-[#110e1a] p-3 rounded-2xl border border-purple-950/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${req.color} flex items-center justify-center font-black text-xs shrink-0`}>
                    {req.name[0]}
                  </div>
                  <div className="text-left min-w-0 leading-tight">
                    <span className="font-extrabold text-white block truncate">{req.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono truncate block">{req.handle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleAcceptRequest(req)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 p-1.5 rounded-xl font-bold transition bubble-hover cursor-pointer"
                    title="Accept Bro Request"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="bg-[#1d1a29] hover:bg-rose-950 hover:text-rose-400 border border-purple-900/30 text-neutral-400 p-1.5 rounded-xl font-bold transition cursor-pointer"
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

      {/* 4. ADD NEW GYM BRO SECTION */}
      <div className="bg-[#191624] p-4.5 rounded-3xl border border-purple-950/30 space-y-3">
        <div className="flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">Add Gym Bros</h3>
        </div>

        {addError && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-400 text-center font-medium">
            ⚠️ {addError}
          </div>
        )}
        {addSuccess && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 text-center font-medium">
            ✨ {addSuccess}
          </div>
        )}

        <form onSubmit={handleAddGymBro} className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Bro's Full Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none text-white placeholder-neutral-500 font-medium"
            />
            <input
              type="text"
              placeholder="Username e.g. @beast"
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
              className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none text-emerald-400 placeholder-neutral-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] bubble-hover cursor-pointer"
          >
            Connect Gym Bro 🤝
          </button>
        </form>
      </div>

      {/* 5. YOUR ACTIVE GYM BROS LIST */}
      <div className="bg-[#191624] p-4.5 rounded-3xl border border-purple-950/30 space-y-3">
        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block pl-1 text-left">
          Your Current Gym Bros ({buddies.length})
        </span>

        {buddies.length === 0 ? (
          <div className="text-center py-4 text-xs text-neutral-500">
            No gym bros connected yet. Invite some above!
          </div>
        ) : (
          <div className="space-y-2">
            {buddies.map((buddy) => (
              <div 
                key={buddy.id}
                className="bg-[#110e1a] p-3 rounded-2xl border border-purple-950/15 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${buddy.avatarColor} flex items-center justify-center font-black text-xs text-neutral-900`}>
                    {buddy.name[0]}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="font-extrabold text-white block">{buddy.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block">{buddy.handle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold">
                    🔥 {buddy.streak}d
                  </span>
                  <button
                    onClick={() => handleRemoveFriend(buddy.id)}
                    className="p-1 hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                    title="Remove Gym Bro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. LOG OUT SECTOR */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full bg-[#191624] hover:bg-rose-950 hover:text-rose-400 border border-purple-950/30 text-neutral-400 font-black py-4 rounded-3xl uppercase tracking-wider text-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Account (Log Out)</span>
        </button>
      </div>

      {/* ADJUST PR LIFT MODAL */}
      {isAddPrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-[#1d1a29] border-2 border-purple-900/30 rounded-3xl p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-purple-950/40 pb-2">
              <h3 className="text-sm font-black font-display text-white">Adjust PR Lifts</h3>
              <button
                onClick={() => setIsAddPrOpen(false)}
                className="p-1.5 bg-neutral-900/60 hover:bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPR} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 mb-1">Select Lift / Exercise</label>
                <select
                  value={prExercise}
                  onChange={(e) => setPrExercise(e.target.value)}
                  className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-2 outline-none font-bold text-white cursor-pointer"
                >
                  {POPULAR_EXERCISES.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={1000}
                    placeholder="e.g. 225"
                    value={prWeight}
                    onChange={(e) => setPrWeight(e.target.value)}
                    className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 mb-1">Max Reps</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={prReps}
                    onChange={(e) => setPrReps(e.target.value)}
                    className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] bubble-hover cursor-pointer"
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

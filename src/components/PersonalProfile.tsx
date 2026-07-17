import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Award, 
  Activity, 
  Camera, 
  X,
  History
} from 'lucide-react';
import { PersonalPR, FitnessGoal, PersonalMilestone, WorkoutPost, UserProfile } from '../types';
import { POPULAR_EXERCISES } from '../initialData';

interface PersonalProfileProps {
  prs: PersonalPR[];
  setPrs: React.Dispatch<React.SetStateAction<PersonalPR[]>>;
  goals: FitnessGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FitnessGoal[]>>;
  milestones: PersonalMilestone[];
  setMilestones: React.Dispatch<React.SetStateAction<PersonalMilestone[]>>;
  posts: WorkoutPost[];
  setPosts: React.Dispatch<React.SetStateAction<WorkoutPost[]>>;
  liftingStreak: number;
  checkedInToday: boolean;
  isRestDay: boolean;
  handleDailyCheckIn: (type: 'workout' | 'rest') => void;
  currentUser: UserProfile;
  allAccounts: UserProfile[];
  onSelectAccount: (acc: UserProfile) => void;
  onLogout: () => void;
}

type ProfileSubTab = 'prs' | 'goals' | 'diary' | 'milestones';

export default function PersonalProfile({
  prs,
  setPrs,
  goals,
  setGoals,
  milestones,
  setMilestones,
  posts,
  setPosts,
  liftingStreak,
  checkedInToday,
  isRestDay,
  handleDailyCheckIn,
  currentUser,
  allAccounts,
  onSelectAccount,
  onLogout
}: PersonalProfileProps) {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('prs');
  
  // New PR Form
  const [isAddPrOpen, setIsAddPrOpen] = useState(false);
  const [prExercise, setPrExercise] = useState(POPULAR_EXERCISES[0]);
  const [prWeight, setPrWeight] = useState('');
  const [prReps, setPrReps] = useState('5');

  // New Goal Form
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalExercise, setGoalExercise] = useState(POPULAR_EXERCISES[0]);
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');

  // Extract user's own posts for the Diary
  const userPosts = useMemo(() => {
    return posts.filter(p => p.buddyId === currentUser.id);
  }, [posts, currentUser.id]);

  // Unlock Milestone Helper
  const unlockMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id && !m.isUnlocked) {
        return { ...m, isUnlocked: true, unlockDate: new Date().toISOString().split('T')[0] };
      }
      return m;
    }));
  };

  // Add a new Personal Record
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

    setPrs(prev => [newPR, ...prev]);

    // Check milestones
    const wt = parseFloat(prWeight);
    if (wt >= 315) {
      unlockMilestone('m4');
    } else if (wt >= 225) {
      unlockMilestone('m3');
    }

    setIsAddPrOpen(false);
    setPrWeight('');
  };

  // Remove PR Record
  const handleRemovePR = (id: string) => {
    if (confirm('Do you want to delete this PR?')) {
      setPrs(prev => prev.filter(item => item.id !== id));
    }
  };

  // Add a new Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTarget || !goalCurrent) return;

    const targetVal = parseFloat(goalTarget);
    const currentVal = parseFloat(goalCurrent);

    const newGoal: FitnessGoal = {
      id: `g-${Date.now()}`,
      exercise: goalExercise,
      targetWeight: targetVal,
      currentWeight: currentVal,
      completed: currentVal >= targetVal,
      deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
    };

    setGoals(prev => [newGoal, ...prev]);
    setIsAddGoalOpen(false);
    setGoalTarget('');
    setGoalCurrent('');
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Delete custom post
  const handleDeletePost = (id: string) => {
    if (confirm('Delete this feed post from history?')) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-6 text-neutral-200 bg-[#0a0a0a]">
      
      {/* Title Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-neutral-900 bg-[#0d0d0d] select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h2 className="text-sm font-black font-display uppercase tracking-tight text-white">Your System Profile</h2>
        </div>
        
        {/* Simple Reset Account Button */}
        <button
          onClick={() => {
            if (confirm('Reset your logs and restart fresh?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="text-[8px] font-bold uppercase tracking-wider text-neutral-500 hover:text-red-400 cursor-pointer"
        >
          Reset App State
        </button>
      </div>

      {/* STREAK & BIO CARD HERO */}
      <div className="p-4 select-none">
        <div className="bg-[#111111] p-4 rounded-3xl border border-neutral-805/85 shadow-md flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-black font-display tracking-tight text-white">{currentUser.name}</h3>
            <p className="text-[10px] text-neutral-400 font-mono">{currentUser.handle} • Since June 2026</p>
            
            <div className="flex items-center gap-2 pt-2.5">
              {checkedInToday ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/30">
                  {isRestDay ? '🛌 Resting Safely today' : '🟢 Volume logged today'}
                </span>
              ) : (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-900/30">
                  ⚪ Incomplete check-in today
                </span>
              )}
            </div>
          </div>

          <div className="text-center py-2 px-3 bg-neutral-950 rounded-2xl border border-neutral-900 shrink-0 select-none">
            <Flame className="w-6 h-6 text-emerald-500 fill-emerald-500/20 mx-auto" />
            <span className="block text-xs font-black text-white leading-none mt-1.5">{liftingStreak}d</span>
            <span className="text-[7.5px] uppercase font-bold tracking-widest text-[#888888] font-mono leading-none">Streak</span>
          </div>
        </div>
      </div>

      {/* PROFILE SECTOR NAVIGATION */}
      <div className="px-4 select-none">
        <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950 border border-neutral-850 rounded-xl text-center text-[10px] font-bold font-sans">
          <button
            onClick={() => setActiveSubTab('prs')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer truncate ${
              activeSubTab === 'prs'
                ? 'bg-neutral-850 text-emerald-400 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏆 Records (PR)
          </button>
          <button
            onClick={() => setActiveSubTab('goals')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer truncate ${
              activeSubTab === 'goals'
                ? 'bg-neutral-850 text-emerald-400 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎯 Goal meters
          </button>
          <button
            onClick={() => setActiveSubTab('diary')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer truncate ${
              activeSubTab === 'diary'
                ? 'bg-neutral-850 text-emerald-400 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🗒️ My Diary
          </button>
          <button
            onClick={() => setActiveSubTab('milestones')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer truncate ${
              activeSubTab === 'milestones'
                ? 'bg-neutral-850 text-emerald-400 font-extrabold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏅 Badges
          </button>
        </div>
      </div>

      {/* VIEWPORT CONTROLS */}
      <div className="px-4 mt-4 space-y-4">
        
        {/* SUBTAB 1: PERSONAL RECORDS */}
        {activeSubTab === 'prs' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center select-none">
              <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">
                Highest registered lift values
              </span>
              <button
                onClick={() => setIsAddPrOpen(true)}
                className="text-[9.5px] font-black uppercase text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition active:scale-95 cursor-pointer"
              >
                + Add PR Record
              </button>
            </div>

            <div className="space-y-2">
              {prs.map(pr => (
                <div key={pr.id} className="bg-[#111111] p-3.5 rounded-2xl border border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-md select-none shrink-0">
                      🏆
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-neutral-100">{pr.exercise}</h4>
                      <p className="text-[8.5px] text-neutral-500 font-mono mt-0.5">Recorded on {pr.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 select-none">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/30">
                      {pr.weight} lbs x {pr.reps} reps
                    </span>
                    <button
                      onClick={() => handleRemovePR(pr.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 rounded transition cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: GOALS & METERS */}
        {activeSubTab === 'goals' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center select-none">
              <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">
                Active fitness goals & milestones
              </span>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="text-[9.5px] font-black uppercase text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition active:scale-95 cursor-pointer"
              >
                + Add Target
              </button>
            </div>

            <div className="space-y-3">
              {goals.map(goal => {
                const percent = Math.min(100, Math.floor((goal.currentWeight / goal.targetWeight) * 100));
                return (
                  <div key={goal.id} className="bg-[#111111] p-4 rounded-2.5xl border border-neutral-800/85 space-y-2.5 relative">
                    <div className="flex justify-between items-start select-none">
                      <div>
                        <h4 className="text-xs font-black text-neutral-100">{goal.exercise}</h4>
                        <p className="text-[8.5px] text-neutral-500 font-mono mt-0.5">Target: {goal.targetWeight} lbs • Current: {goal.currentWeight} lbs</p>
                      </div>

                      <div className="flex items-center gap-2shrink-0">
                        {percent >= 100 ? (
                          <span className="text-[8.5px] font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                            Completed!
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-bold text-[#888888]">
                            {percent}% Complete
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 text-neutral-600 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Simple styled visual progress bar */}
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                      <div 
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 3: MY DIARY */}
        {activeSubTab === 'diary' && (
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest block select-none">
              Your Logged History
            </span>

            {userPosts.length === 0 ? (
              <div className="py-12 bg-[#111111] rounded-2xl border border-neutral-900 border-dashed text-center text-neutral-500 space-y-1.5 select-none">
                <span className="text-2xl block">🗒️</span>
                <p className="text-xs font-medium">You haven't checked-in yet today.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userPosts.map(post => (
                  <div key={post.id} className="bg-[#111111] p-3.5 rounded-2xl border border-neutral-805/85 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 pr-1 select-none">
                      <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-md shrink-0">
                        {post.postType === 'fuel' ? '🍛' : (post.postType === 'rest' ? '🛌' : '🏋️‍♂️')}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-black text-neutral-100 truncate">{post.exercise}</h4>
                        <p className="text-[8.5px] text-neutral-500 font-mono mt-0.5 truncate select-default">
                          {post.postType === 'fuel' 
                            ? `${post.calories} kcal • ${post.proteinGrams}g pro` 
                            : (post.postType === 'rest' 
                              ? 'Active Recovery Logged' 
                              : `${post.weight} lbs • ${post.reps} reps • ${post.sets} sets`)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 transition cursor-pointer shrink-0"
                      title="Remove Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: UNLOCKED MILESTONE BADGES */}
        {activeSubTab === 'milestones' && (
          <div className="space-y-3 select-none">
            <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest block">
              Earned Badges
            </span>

            <div className="grid grid-cols-2 gap-3 pb-2">
              {milestones.map(m => (
                <div 
                  key={m.id} 
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between text-left relative overflow-hidden ${
                    m.isUnlocked 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-neutral-900/40 border-neutral-900 text-neutral-500'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold uppercase truncate pr-1">
                        {m.title}
                      </span>
                      <span className="text-sm">
                        {m.category === 'strength' ? '💪' : (m.category === 'consistency' ? '⚡' : '👥')}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#888888] leading-tight mt-1.5 line-clamp-3">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2 border-t border-neutral-800/40 text-[8px] font-mono font-bold uppercase flex justify-between leading-none">
                    <span>Target</span>
                    <span className={m.isUnlocked ? 'text-emerald-400' : 'text-neutral-500'}>
                      {m.isUnlocked ? 'Unlocked ✓' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- FORMS DIALOG MODAL LAYOUTS --- */}
      {isAddPrOpen && (
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-850 pb-2.5">
              <h3 className="text-xs font-bold uppercase text-white tracking-wide">
                🏆 Add Personal Record
              </h3>
              <button
                onClick={() => setIsAddPrOpen(false)}
                className="p-1 hover:bg-neutral-800 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPR} className="space-y-4 text-xs text-neutral-300">
              <div>
                <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Pr Exercise Lifts</label>
                <select
                  value={prExercise}
                  onChange={(e) => setPrExercise(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                >
                  {POPULAR_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 245"
                    value={prWeight}
                    onChange={(e) => setPrWeight(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Reps Count</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1"
                    value={prReps}
                    onChange={(e) => setPrReps(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition active:scale-95 cursor-pointer"
              >
                Save Personal Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW GOAL DIALOG OUTLINER */}
      {isAddGoalOpen && (
        <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-850 pb-2.5">
              <h3 className="text-xs font-bold uppercase text-white tracking-wide">
                🎯 Add Target Objective
              </h3>
              <button
                onClick={() => setIsAddGoalOpen(false)}
                className="p-1 hover:bg-neutral-800 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs text-neutral-300">
              <div>
                <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Exercise Choice</label>
                <select
                  value={goalExercise}
                  onChange={(e) => setGoalExercise(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                >
                  {POPULAR_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Target weight (lbs)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 315"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-neutral-400 mb-1">Current status weight</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 295"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 outline-none font-bold text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition active:scale-95 cursor-pointer"
              >
                Save Target meter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Flame, Calendar, BarChart3, TrendingUp, HelpCircle, Info, Dumbbell, Sparkles } from 'lucide-react';
import { UserProfile, GymBuddy } from '../types';

interface StreaksTabProps {
  currentUser: UserProfile;
  buddies: GymBuddy[];
  liftingStreak: number;
  workoutDates: string[];
}

export default function StreaksTab({
  currentUser,
  buddies,
  liftingStreak,
  workoutDates
}: StreaksTabProps) {
  
  // Calculate monthly stats
  const totalGymSessions = workoutDates.length;
  
  // Create monthly heatmap grid for current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[currentMonth];

  // Get total days in current month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get starting day of the week (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days array
  const calendarDays: Array<{ dateStr: string; dayNum: number; isLogged: boolean; isToday: boolean } | null> = [];
  
  // Pad preceding empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  // Populate days
  const todayStr = today.toISOString().split('T')[0];
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const formattedDay = d < 10 ? `0${d}` : `${d}`;
    const formattedMonth = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    
    calendarDays.push({
      dateStr,
      dayNum: d,
      isLogged: workoutDates.includes(dateStr),
      isToday: dateStr === todayStr
    });
  }

  // Assemble list of lifters for streak comparison
  const competitors = [
    { name: 'You', streak: liftingStreak, isMe: true, color: 'bg-red-600' },
    ...buddies.map(b => ({
      name: b.name,
      streak: b.streak,
      isMe: false,
      color: b.avatarColor || 'bg-zinc-700'
    }))
  ];

  // Find max streak to calculate bar percentage
  const maxStreakVal = Math.max(...competitors.map(c => c.streak), 1);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-20 bg-zinc-950 text-zinc-100 select-none font-sans p-4 space-y-4">
      
      {/* 1. DYNAMIC STREAK HERO CARD - Heavy Duty Iron */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 rounded-3xl border-2 border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center relative z-10 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-black uppercase text-red-500 tracking-widest block bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">CONSISTENCY</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl font-black tracking-tight text-white font-display">{liftingStreak}</span>
              <span className="text-sm font-black text-zinc-400 uppercase tracking-wider font-mono">DAYS</span>
            </div>
            <p className="text-xs text-zinc-400 font-bold leading-tight">
              {liftingStreak > 0 ? "You're keeping your workout streak burning! 🔥" : "Log a workout photo to ignite your streak today!"}
            </p>
          </div>

          <div className="w-14 h-14 bg-red-600/15 border-2 border-red-600/30 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-600/20">
            🔥
          </div>
        </div>

        {/* Streak details box */}
        <div className="mt-4 pt-3.5 border-t-2 border-zinc-800 grid grid-cols-2 gap-2 text-left">
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider font-mono">Gym Days Logged</span>
            <span className="text-xs font-black text-white font-mono">{totalGymSessions} sessions</span>
          </div>
          <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider font-mono">Streak Rest Status</span>
            <span className="text-xs font-black text-red-400 font-mono">Max 2 Days Rest</span>
          </div>
        </div>
      </div>

      {/* 2. CONSISTENCY CALENDAR GRID */}
      <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800 shadow-md space-y-4">
        <div className="flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-red-500 stroke-[2.5]" />
            <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">
              {currentMonthName} Heatmap
            </h3>
          </div>
          <span className="text-[10px] font-black text-zinc-300 uppercase font-mono bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800">
            {totalGymSessions} LOGGED
          </span>
        </div>

        {/* Calendar Heatmap Grid */}
        <div className="space-y-3">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="text-[10px] font-black text-zinc-500 font-mono">{day}</span>
            ))}
          </div>

          {/* Monthly Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }
              
              return (
                <div
                  key={`day-${day.dayNum}`}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black relative transition border ${
                    day.isLogged 
                      ? 'bg-red-600 text-white shadow-md border-red-500' 
                      : day.isToday
                        ? 'bg-red-600/15 border-2 border-red-500 text-red-400 font-black'
                        : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-850 border-zinc-800'
                  }`}
                  title={day.isLogged ? `${day.dateStr} - Workout Logged!` : `${day.dateStr} - Pending/Rest Day`}
                >
                  <span>{day.dayNum}</span>
                  {day.isLogged && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-zinc-400 pt-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-red-600 block shadow-xs border border-red-500" />
              <span className="font-mono text-zinc-300">Workout Logged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-lg bg-zinc-950 border border-zinc-800 block" />
              <span className="font-mono text-zinc-500">Rest Day</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STREAK COMPARISON BAR CHART */}
      <div className="bg-zinc-900 p-5 rounded-3xl border-2 border-zinc-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-left">
          <BarChart3 className="w-4.5 h-4.5 text-red-500 stroke-[2.5]" />
          <h3 className="text-sm font-black font-display text-white uppercase tracking-tight">
            Squad Streak Leaderboard
          </h3>
        </div>

        {competitors.length === 1 ? (
          <div className="bg-zinc-950 p-4 text-center rounded-2xl text-xs text-zinc-400 font-bold leading-relaxed border border-zinc-800">
            You don't have any gym bros added to compare with yet! Invite custom gym bros in the <b className="text-red-400">Profile tab</b> to populate your competitive leaderboard chart. 👊
          </div>
        ) : (
          <div className="space-y-3.5">
            {competitors
              .sort((a, b) => b.streak - a.streak)
              .map((c, idx) => {
                const percentage = Math.max(12, Math.min(100, (c.streak / maxStreakVal) * 100));
                
                return (
                  <div key={idx} className="space-y-1.5 text-left">
                    {/* Label and numbers */}
                    <div className="flex justify-between items-center text-xs font-black text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                        <span className={c.isMe ? 'text-red-400 font-black' : 'text-white'}>
                          {c.name} {c.isMe ? '(You)' : ''}
                        </span>
                      </div>
                      <span className="font-mono text-white font-black flex items-center gap-1">
                        <span>🔥</span>
                        <span>{c.streak} days</span>
                      </span>
                    </div>

                    {/* Styled Chart Bar */}
                    <div className="w-full h-5 bg-zinc-950 rounded-lg overflow-hidden border-2 border-zinc-800 flex">
                      <div
                        className={`h-full rounded-md transition-all duration-500 ease-out flex items-center pl-2.5 ${
                          c.isMe ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-md' : 'bg-zinc-800 text-zinc-300'
                        }`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider font-mono truncate">
                          {c.streak > 0 ? `${c.streak}d active` : '0d'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 4. EXPLANATORY STREAK LAWS */}
      <div className="bg-red-600/10 border-2 border-red-600/20 p-4.5 rounded-3xl text-left space-y-2.5">
        <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span>OFFICIAL STREAK RULES</span>
        </div>
        <ul className="text-[10.5px] text-zinc-300 space-y-1.5 leading-relaxed font-bold list-disc pl-3">
          <li><b>Downloading RepCheck</b> starts your streak log cycle on day one.</li>
          <li><b>Lifting visits</b> increase your active streak by exactly 1 per day upon camera verification.</li>
          <li><b>3 consecutive rest days</b> kills your streak and resets count back to 0.</li>
          <li>A maximum of <b>2 consecutive rest days</b> is permitted without losing active streak count!</li>
        </ul>
      </div>

    </div>
  );
}

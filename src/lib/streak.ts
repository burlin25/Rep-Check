/**
 * Calculates the current active gym streak based on logged workout dates.
 * 
 * Rules:
 * 1. Starts the day the user downloads/logs first workout.
 * 2. Dies (resets to 0) if there are 3 consecutive rest days (4 or more days since last post).
 * 3. Only increments by 1 for each unique day with a gym workout.
 */
export function calculateStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;
  
  // Sort dates in ascending order
  const sorted = [...dates]
    .map(d => d.trim())
    .filter(Boolean)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  if (sorted.length === 0) return 0;

  // Filter down to unique dates to ensure it only increments once per day
  const uniqueDates: string[] = [];
  const seen = new Set<string>();
  for (const date of sorted) {
    if (!seen.has(date)) {
      seen.add(date);
      uniqueDates.push(date);
    }
  }

  let runningStreak = 1;
  
  // Build streak count by looking at gaps between workouts
  for (let i = 1; i < uniqueDates.length; i++) {
    const d1 = new Date(uniqueDates[i - 1]);
    const d2 = new Date(uniqueDates[i]);
    
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      // 1, 2, or 3 days difference is allowed (at most 2 rest days in between).
      // If diff is 4 days, then there are 3 intermediate rest days in a row, which breaks the streak!
      runningStreak += 1;
    } else {
      // Streak died! Restart counting from 1 starting with this workout
      runningStreak = 1;
    }
  }
  
  // Finally, verify if the streak is currently broken relative to "today"
  const todayStr = new Date().toISOString().split('T')[0];
  const lastWorkoutStr = uniqueDates[uniqueDates.length - 1];
  
  const lastWorkoutDate = new Date(lastWorkoutStr);
  const todayDate = new Date(todayStr);
  
  const diffTimeFromToday = todayDate.getTime() - lastWorkoutDate.getTime();
  const diffDaysFromToday = Math.round(diffTimeFromToday / (1000 * 60 * 60 * 24));
  
  if (diffDaysFromToday >= 4) {
    // If last workout was 4 or more days ago, the streak has expired/died.
    return 0;
  }
  
  return runningStreak;
}

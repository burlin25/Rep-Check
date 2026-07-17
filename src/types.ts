export interface GymBuddy {
  id: string;
  name: string;
  handle: string;
  avatarColor: string; // Tailwind color class, e.g., 'bg-slate-500'
  streak: number; // Lifting/Consistency streak
  checkedInToday: boolean; // Checked in today (as either workout or rest)
  isRestDay: boolean; // Is checking in as resting today
  joinedDate: string;
  isCustom: boolean; // Custom added buddy
}

export interface Comment {
  id: string;
  buddyName: string;
  text: string;
  timestamp: string;
}

export interface WorkoutPost {
  id: string;
  buddyId: string;
  buddyName: string;
  buddyHandle: string;
  buddyAvatarColor: string;
  exercise: string; // Name of exercise or meal
  weight?: number; // Lift weight (lbs) or calories (kcal)
  reps?: number; // Lift reps or protein (g)
  sets?: number; // Sets for lifts
  timestamp: string; // ISO string
  location: string;
  notes?: string;
  fistBumps: number;
  hasFistBumped: boolean;
  comments: Comment[];
  dualImageFront?: string; // Optional selfie
  dualImageBack?: string; // Optional gym pic
  hashtag?: string; // #legs, #bulk, #rest, etc
  isRestDay: boolean; // Rest day designation
  postType: 'workout' | 'fuel' | 'rest'; // Post categories
  proteinGrams?: number;
  calories?: number;
  fuelType?: 'meal' | 'shake';
  fuelEmoji?: string;
}

export interface PersonalPR {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

export interface FitnessGoal {
  id: string;
  exercise: string; // e.g. "Bench Press Streak", "Squat 1RM"
  targetWeight: number;
  currentWeight: number;
  deadline?: string;
  completed: boolean;
}

export interface PersonalMilestone {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'consistency' | 'social';
  requirementText: string;
  isUnlocked: boolean;
  unlockDate?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberIds: string[]; // member buddy ids
  hashtagFilter?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  buddyId: string;
  buddyName: string;
  buddyAvatarColor: string;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  streak: number;
  joinedDate: string;
}


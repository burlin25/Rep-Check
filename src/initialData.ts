import { GymBuddy, WorkoutPost, PersonalPR, FitnessGoal, PersonalMilestone, GroupChat, GroupMessage } from './types';

export const INITIAL_BUDDIES: GymBuddy[] = [
  {
    id: 'b1',
    name: 'Jordan Flex',
    handle: '@flex_jordan',
    avatarColor: 'bg-emerald-500 text-white',
    streak: 12,
    checkedInToday: true,
    isRestDay: false,
    joinedDate: '2026-02-10',
    isCustom: false,
  },
  {
    id: 'b2',
    name: 'Alex Rivera',
    handle: '@squat_queen_alex',
    avatarColor: 'bg-rose-500 text-white',
    streak: 24,
    checkedInToday: true,
    isRestDay: true, // resting today but streak preserved!
    joinedDate: '2026-01-15',
    isCustom: false,
  },
  {
    id: 'b3',
    name: 'Sarah Chen',
    handle: '@deadlift_sarah',
    avatarColor: 'bg-indigo-500 text-white',
    streak: 5,
    checkedInToday: false, // hasn't checked in yet today
    isRestDay: false,
    joinedDate: '2026-03-01',
    isCustom: false,
  },
  {
    id: 'b4',
    name: 'Marcus Brody',
    handle: '@hybrid_marcus',
    avatarColor: 'bg-amber-500 text-white',
    streak: 8,
    checkedInToday: true,
    isRestDay: false,
    joinedDate: '2026-04-12',
    isCustom: false,
  }
];

export const INITIAL_POSTS: WorkoutPost[] = [
  {
    id: 'p1',
    buddyId: 'b1',
    buddyName: 'Jordan Flex',
    buddyHandle: '@flex_jordan',
    buddyAvatarColor: 'bg-emerald-500 text-white',
    exercise: 'Bench Press',
    weight: 275,
    reps: 5,
    sets: 3,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    location: 'Crunch Fitness 🔴',
    notes: 'Last repr was a grinder, but hit 3 sets of 5 at 275. Getting closer to high bar 315!',
    fistBumps: 5,
    hasFistBumped: false,
    comments: [
      {
        id: 'c1',
        buddyName: 'Alex Rivera',
        text: 'Clean reps Jordan! Hit 315 by July easy.',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      }
    ],
    hashtag: '#pushday',
    isRestDay: false,
    postType: 'workout'
  },
  {
    id: 'p2',
    buddyId: 'b2',
    buddyName: 'Alex Rivera',
    buddyHandle: '@squat_queen_alex',
    buddyAvatarColor: 'bg-rose-500 text-white',
    exercise: 'Scheduled Rest & Recovery',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    location: 'Home Stretch Zone 🏠',
    notes: 'Focused on hydration, mobility, and foam rolling today. Rest days keep the lifting streak green and fuel the central nervous system!',
    fistBumps: 6,
    hasFistBumped: true,
    comments: [
      {
        id: 'c2',
        buddyName: 'Marcus Brody',
        text: 'Active rest is key. Solid discipline Alex!',
        timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      }
    ],
    hashtag: '#restday',
    isRestDay: true,
    postType: 'rest'
  },
  {
    id: 'p3',
    buddyId: 'b3',
    buddyName: 'Sarah Chen',
    buddyHandle: '@deadlift_sarah',
    buddyAvatarColor: 'bg-indigo-500 text-white',
    exercise: 'Deadlift Progression',
    weight: 365,
    reps: 5,
    sets: 2,
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    location: "Gold's Gym 🟡",
    notes: 'Volume block feels heavy. Decent bar path and lockout was snappy though.',
    fistBumps: 4,
    hasFistBumped: false,
    comments: [],
    hashtag: '#pullday',
    isRestDay: false,
    postType: 'workout'
  },
  {
    id: 'p4',
    buddyId: 'b1',
    buddyName: 'Jordan Flex',
    buddyHandle: '@flex_jordan',
    buddyAvatarColor: 'bg-emerald-500 text-white',
    exercise: 'Anabolic Rice Container & Roasted Chicken',
    weight: 720, // calories
    reps: 55, // protein
    timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    location: 'Home Prep Station 🍲',
    notes: 'Post-workout meal to capture the anabolic recovery window. Low fat, clean carbs and super high protein.',
    fistBumps: 2,
    hasFistBumped: false,
    comments: [],
    hashtag: '#nutrition',
    isRestDay: false,
    postType: 'fuel',
    proteinGrams: 55,
    calories: 720,
    fuelType: 'meal',
    fuelEmoji: '🍛'
  },
  {
    id: 'p5',
    buddyId: 'b4',
    buddyName: 'Marcus Brody',
    buddyHandle: '@hybrid_marcus',
    buddyAvatarColor: 'bg-amber-500 text-white',
    exercise: 'Whey Protein Recovery Shake',
    weight: 320, // calories
    reps: 40, // protein
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    location: 'LA Fitness 🔵',
    notes: 'Fast recovery post intense shoulder session. Quick, simple, and hits the target macro breakdown.',
    fistBumps: 3,
    hasFistBumped: false,
    comments: [],
    hashtag: '#refueling',
    isRestDay: false,
    postType: 'fuel',
    proteinGrams: 40,
    calories: 320,
    fuelType: 'shake',
    fuelEmoji: '🥛'
  }
];

export const INITIAL_PRS: PersonalPR[] = [
  {
    id: 'pr1',
    exercise: 'Bench Press',
    weight: 225,
    reps: 3,
    date: '2026-04-10',
  },
  {
    id: 'pr2',
    exercise: 'Barbell Squat',
    weight: 255,
    reps: 5,
    date: '2026-05-02',
  },
  {
    id: 'pr3',
    exercise: 'Deadlift',
    weight: 295,
    reps: 2,
    date: '2026-05-12',
  },
];

export const INITIAL_GOALS: FitnessGoal[] = [
  {
    id: 'g1',
    exercise: 'Bench Press Target',
    targetWeight: 245,
    currentWeight: 225,
    deadline: '2026-06-30',
    completed: false,
  },
  {
    id: 'g2',
    exercise: 'Deadlift Goal',
    targetWeight: 315,
    currentWeight: 295,
    deadline: '2026-06-15',
    completed: false,
  },
  {
    id: 'g3',
    exercise: 'Consistency Streak',
    targetWeight: 14, // 14 consecutive active checks
    currentWeight: 9, // current streak starts at 9
    deadline: '2026-06-21',
    completed: false,
  }
];

export const INITIAL_MILESTONES: PersonalMilestone[] = [
  {
    id: 'm1',
    title: 'First Log Check-in',
    description: 'Post your first workout check-in to your buddy feed.',
    category: 'social',
    requirementText: 'Log 1 Workout or Rest Post',
    isUnlocked: true,
    unlockDate: '2026-05-18',
  },
  {
    id: 'm2',
    title: 'Consistency King',
    description: 'Maintain an active checking streak for 7 days (including Rest Days).',
    category: 'consistency',
    requirementText: 'Keep a 7-day consistency streak',
    isUnlocked: true,
    unlockDate: '2026-05-20',
  },
  {
    id: 'm3',
    title: 'Lifting Beast',
    description: 'Log any lift of 225 lbs or greater.',
    category: 'strength',
    requirementText: 'Hit 225 lbs on Bench, Squat, or Deadlift',
    isUnlocked: true,
    unlockDate: '2026-04-10',
  },
  {
    id: 'm4',
    title: 'Three Plates Club',
    description: 'Squat or Deadlift 315 lbs or more.',
    category: 'strength',
    requirementText: 'Hit 315 lbs on Squat or Deadlift',
    isUnlocked: false,
  }
];

export const POPULAR_EXERCISES = [
  'Bench Press 🏋️‍♂️',
  'Barbell Squat 🦵',
  'Deadlift 🪵',
  'Overhead Press 🦾',
  'Barbell Row 🛶',
  'Dumbbell Incline Flyes 🦋',
  'Cable Woodchoppers 🪓',
  'Bicep Dumbbell Curls 🥤',
  'Triceps Pushdowns ⛓️'
];

export const GYM_LOCATIONS = [
  'Crunch Fitness 🔴',
  "Gold's Gym 🟡",
  'Planet Fitness 🟣',
  'LA Fitness 🔵',
  'Anytime Fitness 🟣',
  'Home Gym 🏠',
  'Outside Spot 🌳'
];

export const INITIAL_GROUPS: GroupChat[] = [
  {
    id: 'g-1',
    name: 'Heavy Hitter Club 💪',
    description: 'Group for lifters chasing heavy weights, personal records, and strength gains.',
    icon: '⚡',
    memberIds: ['user-me', 'b1', 'b2', 'b3'],
  },
  {
    id: 'g-2',
    name: 'Cardio & Conditioning 🏃‍♂️',
    description: 'Stamina, HIIT, runs, and light endurance drills.',
    icon: '🔥',
    memberIds: ['user-me', 'b3', 'b4'],
  },
  {
    id: 'g-3',
    name: 'Lean Bulk Diets 🥗',
    description: 'Shariing high-protein macro check-ins, calorie tracking, and clean eating posts.',
    icon: '🍛',
    memberIds: ['user-me', 'b1', 'b2', 'b4'],
  }
];

export const INITIAL_GROUP_MESSAGES: GroupMessage[] = [
  {
    id: 'gm-1',
    groupId: 'g-1',
    buddyId: 'b1',
    buddyName: 'Jordan Flex',
    buddyAvatarColor: 'bg-emerald-500 text-white',
    text: 'Yo! Heading to Crunch in an hour to hit heavier benches. Anyone else working out today?',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'gm-2',
    groupId: 'g-1',
    buddyId: 'b2',
    buddyName: 'Alex Rivera',
    buddyAvatarColor: 'bg-rose-500 text-white',
    text: 'Today is rest day for me, but looking forward to leg day squats tomorrow!',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    id: 'gm-3',
    groupId: 'g-1',
    buddyId: 'user-me',
    buddyName: 'You',
    buddyAvatarColor: 'bg-[#1e1e1e] border border-neutral-700 text-[#dfba6b]',
    text: 'Crushed a solid check-in earlier. Let\'s keep the weekly consistency green!',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

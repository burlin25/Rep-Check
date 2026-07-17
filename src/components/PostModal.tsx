import React, { useState } from 'react';
import { X, Dumbbell, Sparkles } from 'lucide-react';
import { WorkoutPost, UserProfile } from '../types';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  liftingStreak: number;
  onPostCreated: (newPost: WorkoutPost) => void;
}

export default function PostModal({
  isOpen,
  onClose,
  currentUser,
  liftingStreak,
  onPostCreated
}: PostModalProps) {
  const [exercise, setExercise] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!exercise.trim()) {
      setError('Please tell us what you did at the gym today! 🏋️‍♂️');
      return;
    }

    if (!caption.trim()) {
      setError('A caption is required! Share the positive vibes 👊');
      return;
    }

    const newPost: WorkoutPost = {
      id: `p-custom-${Date.now()}`,
      buddyId: currentUser.id,
      buddyName: currentUser.name,
      buddyHandle: currentUser.handle,
      buddyAvatarColor: currentUser.avatarColor,
      exercise: exercise.trim(),
      notes: caption.trim(), // The required caption!
      timestamp: new Date().toISOString(),
      location: '', // Removed locations as they are not necessary
      fistBumps: 0,
      hasFistBumped: false,
      comments: [],
      postType: 'workout',
      isRestDay: false
    };

    onPostCreated(newPost);
    setExercise('');
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#1d1a29] border-2 border-purple-900/30 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 space-y-5 shadow-[0_10px_40px_rgba(139,92,246,0.15)] relative overflow-hidden animate-slide-up">
        {/* Decorative ambient bubble */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-purple-950/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black font-display text-white tracking-tight">Post Gym Update</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-900/60 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-medium text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-neutral-300 ml-1">What did you crush today?</label>
            <input
              type="text"
              placeholder="e.g. Bench Press, Leg Day, 5K Run ⚡"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-[#110e1a] border-2 border-neutral-800/80 focus:border-emerald-500/60 rounded-2xl py-3 px-4 outline-none font-bold text-white placeholder-neutral-500 transition text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-neutral-300 ml-1">Caption <span className="text-emerald-400 font-black">*Required</span></label>
              <span className="text-[10px] text-neutral-500 font-mono">{caption.length}/140</span>
            </div>
            <textarea
              rows={3}
              placeholder="Write a welcoming caption... forces you to add one! 👊"
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 140))}
              className="w-full bg-[#110e1a] border-2 border-neutral-800/80 focus:border-emerald-500/60 rounded-2xl py-3 px-4 outline-none text-white placeholder-neutral-500 resize-none transition text-sm font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-4 rounded-2xl uppercase tracking-wider text-xs shadow-md shadow-emerald-500/15 bubble-hover cursor-pointer"
          >
            Publish Gym Update 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

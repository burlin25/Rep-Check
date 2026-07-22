import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Dumbbell, Sparkles, Check, UploadCloud, X } from 'lucide-react';
import { WorkoutPost, UserProfile } from '../types';

interface PostTabProps {
  currentUser: UserProfile;
  onPostCreated: (newPost: WorkoutPost) => void;
  setActiveTab: (tab: 'feed' | 'chats' | 'post' | 'streaks' | 'profile') => void;
}

export default function PostTab({ currentUser, onPostCreated, setActiveTab }: PostTabProps) {
  const [exercise, setExercise] = useState('');
  const [caption, setCaption] = useState('');
  const [uploadedPhotoBase64, setUploadedPhotoBase64] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Convert uploaded image to Base64 preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedPhotoBase64(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setUploadedPhotoBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Photo requirement: must have base64 uploaded photo
    if (!uploadedPhotoBase64) {
      setError('Please upload a gym photo to verify your session! 📸');
      return;
    }

    // Exercise focus: mandatory
    if (!exercise.trim()) {
      setError('Please specify the exercise or muscle focus! 🏋️‍♂️');
      return;
    }

    const newPost: WorkoutPost = {
      id: `p-custom-${Date.now()}`,
      buddyId: currentUser.id,
      buddyName: currentUser.name,
      buddyHandle: currentUser.handle,
      buddyAvatarColor: currentUser.avatarColor,
      exercise: exercise.trim(),
      notes: caption.trim() || undefined, // Optional caption!
      timestamp: new Date().toISOString(),
      location: '',
      fistBumps: 0,
      hasFistBumped: false,
      comments: [],
      postType: 'workout',
      isRestDay: false,
      dualImageFront: uploadedPhotoBase64, // base64 photo
    };

    onPostCreated(newPost);
    
    // Reset fields
    setExercise('');
    setCaption('');
    setUploadedPhotoBase64(null);

    // Redirect to the Feed Tab
    setActiveTab('feed');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-zinc-950 select-none text-zinc-100 font-sans p-5 space-y-5">
      {/* Header */}
      <div className="text-left space-y-1 bg-zinc-900/80 p-4 rounded-2xl border-2 border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-black uppercase text-red-500 tracking-widest bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30">VERIFIED LOG</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white font-display uppercase">PUBLISH SESSION</h2>
        <p className="text-xs text-zinc-400 font-medium">Capture a photo at the gym to verify your daily consistency.</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-600/15 border-2 border-rose-600/30 rounded-2xl text-xs text-rose-400 font-black text-center">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* PHOTO REQUIREMENT BOX */}
        <div className="space-y-2 text-left">
          <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">
            Workout Photo <span className="text-red-500">*Required Camera Proof</span>
          </label>
          
          {/* Upload Zone */}
          <div 
            onClick={() => !uploadedPhotoBase64 && fileInputRef.current?.click()}
            className={`relative min-h-[220px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 p-4 transition ${
              uploadedPhotoBase64 
                ? 'border-emerald-500/60 bg-emerald-500/10' 
                : 'border-zinc-800 hover:border-red-600/60 bg-zinc-900/80 cursor-pointer shadow-md'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            {uploadedPhotoBase64 ? (
              <div className="relative w-full min-h-[200px] rounded-2xl overflow-hidden group border-2 border-zinc-700">
                <img src={uploadedPhotoBase64} alt="Preview" className="w-full h-56 object-cover" />
                <div className="absolute top-2.5 right-2.5 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-[10px] text-white font-black uppercase bg-zinc-950/90 hover:bg-zinc-900 px-3 py-1.5 rounded-xl backdrop-blur-xs transition border border-zinc-700 shadow-sm"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearPhoto();
                    }}
                    className="p-2 text-white bg-rose-600/90 hover:bg-rose-600 rounded-xl backdrop-blur-xs transition shadow-sm"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3.5">
                <div className="w-14 h-14 rounded-2xl bg-red-600/15 flex items-center justify-center text-red-500 mx-auto shadow-md border-2 border-red-600/30">
                  <UploadCloud className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div className="leading-normal">
                  <span className="block text-xs font-black text-white uppercase tracking-wider">Upload Camera Photo</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Select photo from camera roll to verify reps</span>
                </div>
                <span className="inline-block text-[9px] font-black bg-red-600/15 border border-red-600/30 text-red-400 px-3 py-1 rounded-xl uppercase tracking-widest font-mono">
                  CAMERA PROOF REQUIRED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* FOCUS / EXERCISE (MANDATORY) */}
        <div className="space-y-1 text-left">
          <label className="block text-xs font-black text-white uppercase tracking-wider ml-1">
            Exercise or Muscle Focus <span className="text-red-500">*Required</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Legs squat 225lbs, Heavy Bench Day, 5K Outdoor Run ⚡"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 rounded-2xl py-3.5 px-4 outline-none font-bold text-white placeholder-zinc-500 transition text-sm shadow-sm"
            required
          />
        </div>

        {/* CAPTION (OPTIONAL) */}
        <div className="space-y-1 text-left">
          <div className="flex justify-between items-center px-1">
            <label className="block text-xs font-black text-white uppercase tracking-wider">
              Caption <span className="text-zinc-500 font-bold">(Optional)</span>
            </label>
            <span className="text-[10px] text-zinc-500 font-mono font-bold">{caption.length}/140</span>
          </div>
          <textarea
            rows={3}
            placeholder="How did it feel? (e.g. Grinded out a solid new PR or simple recovery session today!)"
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, 140))}
            className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 rounded-2xl py-3 px-4 outline-none text-white placeholder-zinc-500 resize-none transition text-sm font-semibold shadow-sm"
          />
        </div>

        {/* PUBLISH BUTTON */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-xs shadow-lg shadow-red-600/25 border-2 border-red-500/30 bubble-hover cursor-pointer"
        >
          Publish Gym Log 🚀
        </button>
      </form>
    </div>
  );
}

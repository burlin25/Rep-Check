import React, { useState } from 'react';
import { Flame, MessageCircle, Heart, Share2, Award, Calendar, Dumbbell, Sparkles } from 'lucide-react';
import { WorkoutPost, UserProfile, GymBuddy } from '../types';

interface FeedTabProps {
  posts: WorkoutPost[];
  currentUser: UserProfile;
  buddies: GymBuddy[];
  onAddFistBump: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  setActiveTab: (tab: 'feed' | 'chats' | 'post' | 'streaks' | 'profile') => void;
}

export default function FeedTab({
  posts,
  currentUser,
  buddies,
  onAddFistBump,
  onAddComment,
  setActiveTab
}: FeedTabProps) {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Human-friendly relative time formatter
  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Today';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-zinc-950 text-zinc-100 select-none font-sans p-4 space-y-4 pb-20">
      
      {/* Dynamic Top Stat Bar - Heavy Duty Steel Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 to-black px-4.5 py-4 rounded-2xl shadow-xl flex items-center justify-between text-white relative overflow-hidden border-2 border-zinc-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="text-left relative z-10 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-black uppercase text-red-500 tracking-widest block">FORGED IN STEEL</span>
            <span className="text-[8px] font-mono font-black text-zinc-500 bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-700">45LB</span>
          </div>
          <h2 className="text-xl font-black font-display tracking-tight text-white uppercase">SQUAD FEED</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-red-600/15 px-3 py-1.5 rounded-xl border-2 border-red-600/30 text-xs font-black text-red-400 relative z-10 shadow-lg shadow-red-600/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono tracking-wider">{buddies.length + 1} LIFTERS</span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-zinc-800 shadow-lg text-center space-y-4 py-12">
          <div className="w-16 h-16 rounded-3xl bg-red-600/15 flex items-center justify-center mx-auto text-red-500 border-2 border-red-600/30 shadow-md">
            <Dumbbell className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white font-display uppercase tracking-tight">SQUAD FEED IS QUIET</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed font-medium">
              No one has posted a workout yet! Be the trendsetter and log your gym session to start the chain.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('post')}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs px-5 py-3.5 rounded-2xl uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-lg shadow-red-600/30 border-2 border-red-500/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Gym Log</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            // Check if this post is from a template card
            let isTemplate = false;
            let templateGradient = '';
            let templateIcon = '';
            
            if (post.hashtag && post.hashtag.startsWith('template:')) {
              const parts = post.hashtag.split(':');
              if (parts.length >= 3) {
                isTemplate = true;
                templateGradient = parts[1];
                templateIcon = parts[2];
              }
            }

            const hasFistBumped = post.hasFistBumped;

            return (
              <div 
                key={post.id} 
                className="bg-zinc-900 rounded-3xl border-2 border-zinc-800/90 shadow-md overflow-hidden flex flex-col text-left hover:border-zinc-700/80 transition"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b-2 border-zinc-800/80 bg-zinc-900/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl ${post.buddyAvatarColor || 'bg-zinc-800 text-zinc-200'} flex items-center justify-center font-black text-sm border border-zinc-700/50 shadow-xs`}>
                      {post.buddyName ? post.buddyName[0].toUpperCase() : 'B'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white text-xs truncate leading-tight">
                          {post.buddyName}
                        </span>
                        <span className="text-[8px] font-mono font-black text-red-500 bg-red-600/10 px-1.5 py-0.2 rounded border border-red-600/20">RAW</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono block truncate">
                        {post.buddyHandle}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono font-bold bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                    {formatTimeAgo(post.timestamp)}
                  </span>
                </div>

                {/* Gym Workout Focus Badge */}
                <div className="px-4 pt-3 pb-1 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1.5 bg-red-600/15 border-2 border-red-600/30 text-red-400 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider shadow-xs">
                    <Dumbbell className="w-3.5 h-3.5 text-red-400 stroke-[2.5]" />
                    <span>{post.exercise}</span>
                  </span>
                  <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                    VERIFIED REP
                  </span>
                </div>

                {/* Optional Caption Text */}
                {post.notes && (
                  <p className="px-4 pt-1.5 pb-2 text-xs text-zinc-200 font-bold leading-relaxed">
                    {post.notes}
                  </p>
                )}

                {/* MANDATORY PHOTO OR GRAPHIC AREA */}
                <div className="px-4 pb-3">
                  {isTemplate ? (
                    /* Render gradient template activity card */
                    <div className={`h-40 rounded-2xl ${templateGradient} flex flex-col justify-between p-4.5 shadow-lg relative overflow-hidden group border-2 border-white/10`}>
                      {/* Decorative layout design */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-3xl leading-none">{templateIcon}</span>
                        <span className="text-[9px] font-black bg-black/60 text-white px-2.5 py-1 rounded-lg uppercase tracking-widest font-mono backdrop-blur-xs border border-white/20">
                          HARDCORE CERTIFIED
                        </span>
                      </div>

                      <div className="space-y-1 relative z-10">
                        <span className="text-[10px] font-black uppercase text-white/80 tracking-widest block font-mono">IRON SESSION FOCUS</span>
                        <h4 className="text-lg font-black text-white tracking-tight leading-tight uppercase font-display truncate">
                          {post.exercise}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-white/90 font-black">
                          <span>🏋️‍♂️ {post.buddyName} crushed it</span>
                        </div>
                      </div>
                    </div>
                  ) : post.dualImageFront ? (
                    /* Render real base64 uploaded photo */
                    <div className="h-56 rounded-2xl overflow-hidden shadow-md border-2 border-zinc-800 bg-zinc-950 relative">
                      <img 
                        src={post.dualImageFront} 
                        alt="Gym update snapshot" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-2 right-2 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700/80 text-[9px] font-mono font-black text-red-400">
                        CAMERA PROOF
                      </div>
                    </div>
                  ) : (
                    /* Fallback placeholder card */
                    <div className="h-32 rounded-2xl bg-zinc-950 border-2 border-zinc-800 flex flex-col justify-center items-center text-center p-4">
                      <Dumbbell className="w-6 h-6 text-red-500 mb-1" />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider font-mono">Session Verified</span>
                    </div>
                  )}
                </div>

                {/* Post Footer Actions */}
                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t-2 border-zinc-800/80 mt-1 bg-zinc-900/40">
                  <div className="flex items-center gap-3">
                    {/* Knucks (Fist Bump) button */}
                    <button
                      onClick={() => onAddFistBump(post.id)}
                      className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-black transition active:scale-90 cursor-pointer border-2 ${
                        hasFistBumped 
                          ? 'bg-red-600/20 text-red-400 border-red-600/50 shadow-md shadow-red-600/20' 
                          : 'bg-zinc-950 hover:bg-zinc-850 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-sm">👊</span>
                      <span className="font-mono tracking-tight">{post.fistBumps} Knucks</span>
                    </button>

                    {/* Comments toggle button */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-red-400 transition cursor-pointer bg-zinc-950 py-2 px-3 rounded-xl border border-zinc-800"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.3]" />
                      <span className="font-mono">{post.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Comments Panel */}
                {expandedComments[post.id] && (
                  <div className="px-4 pb-4 bg-zinc-950 border-t-2 border-zinc-800 space-y-3 pt-3">
                    {post.comments.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="text-xs text-left leading-tight bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-white text-[11px]">
                                {comment.buddyName}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-mono font-bold">
                                {formatTimeAgo(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-zinc-300 font-semibold text-[11px] leading-relaxed">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Say congrats or support... 👊"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-xl py-2 px-3 text-xs outline-none text-white placeholder-zinc-500 focus:border-red-600 font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-black text-[10px] px-3.5 py-2 rounded-xl uppercase tracking-wider cursor-pointer shadow-md shadow-red-600/20"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

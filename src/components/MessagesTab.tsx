import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Send, 
  Plus, 
  X, 
  Flame, 
  Dumbbell, 
  Award, 
  Calendar,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { GymBuddy, WorkoutPost, GroupChat, GroupMessage, PersonalPR, UserProfile, Comment } from '../types';
import { INITIAL_GROUPS, INITIAL_GROUP_MESSAGES } from '../initialData';

interface MessagesTabProps {
  buddies: GymBuddy[];
  posts: WorkoutPost[];
  setPosts: React.Dispatch<React.SetStateAction<WorkoutPost[]>>;
  currentUser: UserProfile;
  liftingStreak: number;
}

export default function MessagesTab({
  buddies,
  posts,
  setPosts,
  currentUser,
  liftingStreak
}: MessagesTabProps) {
  const [subTab, setSubTab] = useState<'feed' | 'chats' | 'consistency'>('feed');

  // --- GROUPS STATE ---
  const [groups, setGroups] = useState<GroupChat[]>(() => {
    const saved = localStorage.getItem('repcheck_groupchats');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(() => {
    const saved = localStorage.getItem('repcheck_group_messages');
    return saved ? JSON.parse(saved) : INITIAL_GROUP_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('repcheck_groupchats', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('repcheck_group_messages', JSON.stringify(groupMessages));
  }, [groupMessages]);

  const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  
  // Create Group Form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('💪');

  // --- SELECTED BUDDY PROFILE MODAL STATE ---
  const [selectedBuddy, setSelectedBuddy] = useState<GymBuddy | UserProfile | null>(null);
  const [buddyPrs, setBuddyPrs] = useState<PersonalPR[]>([]);

  // Ref for auto scroll in group chats
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeGroup && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [groupMessages, activeGroup]);

  // Combine buddies and user for consistency profiles
  const allPeople = useMemo(() => {
    const me: GymBuddy = {
      id: currentUser.id,
      name: currentUser.name,
      handle: currentUser.handle,
      avatarColor: currentUser.avatarColor,
      streak: liftingStreak,
      checkedInToday: true,
      isRestDay: false,
      joinedDate: currentUser.joinedDate || 'June 2026',
      isCustom: false
    };
    return [me, ...buddies];
  }, [currentUser, buddies, liftingStreak]);

  // Handle viewing a profile
  const handleOpenProfile = (person: GymBuddy | UserProfile) => {
    setSelectedBuddy(person);
    // Retrieve or mock PRs for selected buddy
    const key = `gymsocial_prs_${person.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setBuddyPrs(JSON.parse(saved));
    } else {
      // Provide clean initial PRs matching typical gym stats for simulation
      const mockPRs: Record<string, PersonalPR[]> = {
        'b1': [
          { id: '1', exercise: 'Bench Press 🏋️‍♂️', weight: 285, reps: 3, date: '2026-05-12' },
          { id: '2', exercise: 'Barbell Squat 🦵', weight: 335, reps: 5, date: '2026-05-20' }
        ],
        'b2': [
          { id: '1', exercise: 'Barbell Squat 🦵', weight: 225, reps: 5, date: '2026-04-18' },
          { id: '2', exercise: 'Deadlift 🪵', weight: 275, reps: 3, date: '2026-05-01' }
        ],
        'b3': [
          { id: '1', exercise: 'Deadlift 🪵', weight: 365, reps: 5, date: '2026-05-10' },
          { id: '2', exercise: 'Bench Press 🏋️‍♂️', weight: 185, reps: 8, date: '2026-04-22' }
        ],
        'b4': [
          { id: '1', exercise: 'Bicep Dumbbell Curls 🥤', weight: 60, reps: 10, date: '2026-05-15' },
          { id: '2', exercise: 'Overhead Press 🦾', weight: 165, reps: 5, date: '2026-05-11' }
        ]
      };
      setBuddyPrs(mockPRs[person.id] || [
        { id: '1', exercise: 'Bench Press 🏋️‍♂️', weight: 185, reps: 5, date: '2026-06-01' },
        { id: '2', exercise: 'Barbell Squat 🦵', weight: 225, reps: 5, date: '2026-06-10' }
      ]);
    }
  };

  // --- KNUCKS 👊 & COMMENTS ---
  const handleKnuckClick = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          fistBumps: p.hasFistBumped ? p.fistBumps - 1 : p.fistBumps + 1,
          hasFistBumped: !p.hasFistBumped
        };
      }
      return p;
    }));
  };

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      buddyName: currentUser.name,
      text: commentText,
      timestamp: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // --- SEND CHAT MESSAGE ---
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeGroup) return;

    const newMsg: GroupMessage = {
      id: `msg-${Date.now()}`,
      groupId: activeGroup.id,
      buddyId: currentUser.id,
      buddyName: currentUser.name,
      buddyAvatarColor: currentUser.avatarColor,
      text: chatInput.trim(),
      timestamp: new Date().toISOString()
    };

    setGroupMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Responsive simulation reply
    setTimeout(() => {
      const activeGroupMembers = allPeople.filter(m => m.id !== currentUser.id);
      if (activeGroupMembers.length === 0) return;
      const responder = activeGroupMembers[Math.floor(Math.random() * activeGroupMembers.length)];

      const friendlyReplies = [
        "Let's go! Absolute beast mode. 👊",
        "Keep crushing those sets! 🔥",
        "Consistency always wins. Proud of the squad!",
        "Active days only. See you at the rack! 🏋️‍♂️",
        "Virtually spotting you! Let's get it. ⚡",
        "That consistency streak is wild! Keep pushing."
      ];

      const simulatedReply: GroupMessage = {
        id: `msg-reply-${Date.now()}`,
        groupId: activeGroup.id,
        buddyId: responder.id,
        buddyName: responder.name,
        buddyAvatarColor: responder.avatarColor,
        text: friendlyReplies[Math.floor(Math.random() * friendlyReplies.length)],
        timestamp: new Date().toISOString()
      };

      setGroupMessages(prev => [...prev, simulatedReply]);
    }, 1500);
  };

  // --- CREATE NEW CHAT GROUP ---
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newChat: GroupChat = {
      id: `group-custom-${Date.now()}`,
      name: `${newGroupName.trim()} ${newGroupIcon}`,
      description: newGroupDesc.trim() || 'Custom gym bro community',
      icon: newGroupIcon,
      memberIds: ['user-me', ...buddies.map(b => b.id)]
    };

    setGroups(prev => [...prev, newChat]);
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupIcon('💪');
    setIsCreateGroupOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0b15] select-none text-neutral-100 font-sans">
      
      {/* HEADER SECTION */}
      <div className="px-5 pt-6 pb-4 border-b border-purple-950/40 bg-[#14121d] flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/10">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight text-white uppercase">RepCheck</h2>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">Gym Social Network</p>
            </div>
          </div>
          
          {subTab === 'chats' && !activeGroup && (
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="flex items-center gap-1.5 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer select-none bubble-hover"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Group</span>
            </button>
          )}
        </div>

        {/* BUBBLY TOP TAB SWITCHER */}
        {!activeGroup && (
          <div className="grid grid-cols-3 gap-1.5 bg-[#08070d] p-1.5 rounded-2xl border border-purple-950/30">
            <button
              onClick={() => setSubTab('feed')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer select-none ${
                subTab === 'feed'
                  ? 'bg-emerald-500 text-neutral-950 font-black shadow-lg shadow-emerald-500/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              👊 Gym Feed
            </button>
            
            <button
              onClick={() => setSubTab('chats')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer select-none ${
                subTab === 'chats'
                  ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-500/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              💬 Group Chats
            </button>
            
            <button
              onClick={() => setSubTab('consistency')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer select-none ${
                subTab === 'consistency'
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              📊 Consistency
            </button>
          </div>
        )}
      </div>

      {/* INNER VIEW CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        
        {/* VIEW 1: BUBBLY GYM UPDATES FEED */}
        {subTab === 'feed' && (
          <div className="space-y-4 pb-16">
            {posts.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="text-sm font-bold text-neutral-400">No gym updates streaming yet.</p>
                <p className="text-xs text-neutral-500">Hit that center bottom Post button to publish yours! 👊</p>
              </div>
            ) : (
              posts.map((post) => {
                const authorIsUser = post.buddyId === currentUser.id;
                return (
                  <div 
                    key={post.id} 
                    className="bg-[#191624] border border-purple-950/30 rounded-3xl p-4.5 space-y-3.5 shadow-sm hover:shadow-md transition duration-200"
                  >
                    {/* User Info Line */}
                    <div className="flex items-center justify-between">
                      <div 
                        onClick={() => {
                          const matchingPerson = allPeople.find(p => p.id === post.buddyId);
                          if (matchingPerson) handleOpenProfile(matchingPerson);
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-2xl ${post.buddyAvatarColor} flex items-center justify-center font-black text-sm text-neutral-900 group-hover:scale-105 transition`}>
                          {post.buddyName[0]}
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition flex items-center gap-1">
                            {post.buddyName}
                            {authorIsUser && <span className="text-[9px] bg-emerald-950/60 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-900/30">You</span>}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-mono">{post.buddyHandle}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono">
                        {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Workout Details */}
                    <div className="bg-[#110e1a] p-3 rounded-2xl border border-purple-950/20 text-left">
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-tight font-display">
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>{post.exercise}</span>
                      </div>
                      
                      {/* Caption/Notes (strictly forced & shown here!) */}
                      {post.notes && (
                        <p className="text-xs text-neutral-300 font-medium leading-relaxed mt-2 select-text">
                          {post.notes}
                        </p>
                      )}
                    </div>

                    {/* Knucks Actions Sector */}
                    <div className="flex items-center justify-between pt-1 border-t border-purple-950/20">
                      <button
                        onClick={() => handleKnuckClick(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer select-none bubble-hover ${
                          post.hasFistBumped
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#110e1a] text-neutral-400 hover:text-white border border-neutral-900'
                        }`}
                      >
                        <span className="text-sm">👊</span>
                        <span>{post.fistBumps} Knucks</span>
                      </button>

                      <div className="text-[10px] text-neutral-400 font-bold font-mono">
                        💬 {post.comments.length} Comments
                      </div>
                    </div>

                    {/* Comments List */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 bg-[#110e1a]/50 p-2.5 rounded-2xl max-h-40 overflow-y-auto no-scrollbar border border-purple-950/10">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="text-left text-xs leading-normal">
                            <span className="font-extrabold text-white mr-1.5">{comment.buddyName}:</span>
                            <span className="text-neutral-300 font-medium">{comment.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post Comment Input Form */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Say something friendly... 👊"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 bg-[#110e1a] border border-purple-950/30 rounded-xl py-1.5 px-3 outline-none text-xs text-white placeholder-neutral-500"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black transition bubble-hover cursor-pointer"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VIEW 2: GROUP CHATS SECTOR */}
        {subTab === 'chats' && !activeGroup && (
          <div className="space-y-3 pb-16">
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/20 p-4 rounded-3xl border border-purple-900/20 space-y-1">
              <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-widest font-display">LIFTING COMMUNITIES</h3>
              <p className="text-[11px] text-neutral-400 leading-normal font-medium">
                Create chat rooms, sync workout notes, and motivate your gym bros to keep their consistency streaks hot.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block pl-1">Active Rooms</span>
              
              {groups.map((grp) => {
                const groupMsgs = groupMessages.filter(m => m.groupId === grp.id);
                return (
                  <button
                    key={grp.id}
                    onClick={() => setActiveGroup(grp)}
                    className="w-full text-left bg-[#191624] hover:bg-purple-950/20 border border-purple-950/20 p-4 rounded-3xl flex items-center gap-4 transition duration-150 active:scale-[0.98] select-none cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#110e1a] border-2 border-purple-900/30 flex items-center justify-center text-2xl shrink-0">
                      {grp.icon || '💬'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-black text-white truncate">{grp.name}</h4>
                        <span className="text-[9px] font-extrabold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-900/20 font-mono">
                          {grp.memberIds.length} bros
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-normal line-clamp-1 mt-0.5 select-text">
                        {grp.description}
                      </p>
                      <span className="text-[9px] text-neutral-500 font-mono mt-2 block">
                        💬 {groupMsgs.length} messages active
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVE GROUP CHAT ROOM WINDOW */}
        {subTab === 'chats' && activeGroup && (
          <div className="flex flex-col h-[70vh] bg-[#14121d] border border-purple-950/30 rounded-3xl overflow-hidden animate-slide-up">
            {/* Active Group Header */}
            <div className="px-4 py-3.5 bg-[#191624] border-b border-purple-950/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveGroup(null)}
                  className="p-1.5 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </button>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white flex items-center gap-1">
                    <span>{activeGroup.icon}</span>
                    <span>{activeGroup.name}</span>
                  </h4>
                  <p className="text-[9px] text-neutral-400 font-mono leading-none truncate max-w-[200px]">{activeGroup.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/20 uppercase tracking-widest font-mono">
                  SQUAD ONLINE
                </span>
              </div>
            </div>

            {/* Chats scrolling area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5">
              {groupMessages.filter(m => m.groupId === activeGroup.id).map((msg) => {
                const isMe = msg.buddyId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[90%] ${isMe ? 'ml-auto' : 'mr-auto'} space-y-1`}>
                    {!isMe && (
                      <span className="text-[10px] text-purple-300 font-black font-mono pl-1">{msg.buddyName}</span>
                    )}
                    <div className={`p-3 rounded-2xl text-xs font-medium ${
                      isMe 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : 'bg-[#191624] border border-purple-950/20 text-neutral-100 rounded-bl-none'
                    } text-left select-text`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-neutral-500 font-mono pr-1 pl-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input sending bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-[#191624] border-t border-purple-950/30 flex gap-2">
              <input
                type="text"
                placeholder="Message group... 👊"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#110e1a] border border-purple-950/20 rounded-2xl py-2.5 px-4 outline-none text-xs text-white placeholder-neutral-500"
                required
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 p-2.5 rounded-2xl transition shadow-md shadow-emerald-500/10 bubble-hover cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: CONSISTENCY CHART & LEADERBOARD */}
        {subTab === 'consistency' && (
          <div className="space-y-4 pb-16">
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-900/10 p-4 rounded-3xl border border-amber-500/20 text-left space-y-1">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest font-display">CONSISTENCY DASHBOARD</h3>
              <p className="text-[11px] text-neutral-400 leading-normal font-medium">
                Compare streaks with other gym bros. Click on any profile to view their detailed Consistency profile and personal record PR lifts!
              </p>
            </div>

            <div className="bg-[#191624] border border-purple-950/30 p-4.5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white uppercase tracking-tight font-display">Active Streaks Chart</span>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase font-mono">⚡ DAYS CONNECTED</span>
              </div>

              {/* Bubbly graphical representation of streaks */}
              <div className="space-y-3.5">
                {allPeople
                  .sort((a, b) => b.streak - a.streak)
                  .map((person) => {
                    const maxStreak = Math.max(...allPeople.map(p => p.streak), 1);
                    const percentage = Math.min(100, Math.max(15, (person.streak / maxStreak) * 100));
                    const isCurrentUser = person.id === currentUser.id;

                    return (
                      <div 
                        key={person.id}
                        onClick={() => handleOpenProfile(person)}
                        className="space-y-1 cursor-pointer group"
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-neutral-300 group-hover:text-emerald-300 transition">
                            <span className="text-sm font-normal">👤</span>
                            <span>{person.name}</span>
                            {isCurrentUser && <span className="text-[8px] bg-amber-950/50 text-amber-400 px-1.5 py-0.5 rounded uppercase border border-amber-900/30">You</span>}
                          </span>
                          <span className="font-mono text-white flex items-center gap-1 font-black">
                            🔥 {person.streak} Days
                          </span>
                        </div>

                        {/* Bubbly Bar graph */}
                        <div className="w-full h-3.5 bg-[#110e1a] rounded-full overflow-hidden border border-purple-950/20 relative">
                          <div 
                            style={{ width: `${percentage}%` }}
                            className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                              isCurrentUser
                                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Mini directory of buddies */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1 block">Gym Bro Profiles</span>
              <div className="grid grid-cols-2 gap-2.5">
                {allPeople.map(person => (
                  <button
                    key={person.id}
                    onClick={() => handleOpenProfile(person)}
                    className="bg-[#191624] border border-purple-950/20 hover:border-emerald-500/30 p-3 rounded-2.5xl flex flex-col items-center text-center space-y-1.5 transition duration-150 select-none cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-2xl ${person.avatarColor} flex items-center justify-center font-black text-xs text-neutral-900`}>
                      {person.name[0]}
                    </div>
                    <div className="leading-tight">
                      <h5 className="text-xs font-black text-white line-clamp-1">{person.name}</h5>
                      <span className="text-[9px] text-neutral-400 font-mono">{person.handle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- CREATE CHAT GROUP DIALOG --- */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1d1a29] border-2 border-purple-900/30 rounded-3xl p-5 space-y-4 shadow-2xl relative animate-slide-up">
            <div className="flex justify-between items-center border-b border-purple-950/40 pb-2">
              <h3 className="text-sm font-black font-display text-white">Create Squad Room</h3>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="p-1.5 bg-neutral-900/60 hover:bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Warriors, Early Bird Lifting"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none font-bold text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 mb-1">Slogan / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Chasing heavy weights and zero rest day skips!"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-[#110e1a] border border-purple-950/30 rounded-xl py-2 px-3 outline-none text-neutral-200 placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 mb-1">Select Squad Icon Emoji</label>
                <div className="grid grid-cols-5 gap-1 text-center">
                  {['💪', '⚡', '🔥', '🏆', '🎯', '🏃‍♂️', '🥩', '🦾', '🥛', '🥬'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewGroupIcon(em)}
                      className={`py-1.5 rounded-lg text-lg transition cursor-pointer ${
                        newGroupIcon === em ? 'bg-purple-600' : 'bg-[#110e1a] hover:bg-neutral-800'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] bubble-hover cursor-pointer"
              >
                Assemble Squad 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SELECTED GYM BRO PROFILE / PR POPUP --- */}
      {selectedBuddy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#1d1a29] border-2 border-purple-900/40 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden animate-slide-up">
            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

            {/* Card Header details */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${selectedBuddy.avatarColor} flex items-center justify-center font-black text-base text-neutral-900`}>
                  {selectedBuddy.name[0]}
                </div>
                <div className="text-left">
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    {selectedBuddy.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">{selectedBuddy.handle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuddy(null)}
                className="p-1.5 bg-neutral-900/60 hover:bg-neutral-800 rounded-full text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Consistency Statistics badge */}
            <div className="bg-[#110e1a] p-3.5 rounded-2xl border border-purple-950/20 flex justify-between items-center text-left">
              <div>
                <p className="text-[9px] font-black uppercase text-amber-400 font-mono tracking-widest">Consistency Streak</p>
                <h4 className="text-lg font-black text-white font-display mt-0.5">
                  🔥 {selectedBuddy.streak} Days Streak
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-neutral-500 uppercase block">Since</span>
                <span className="text-xs text-neutral-300 font-bold">June 2026</span>
              </div>
            </div>

            {/* Personal Records Lift PR list */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1 block">
                🏋️‍♂️ Certified Personal PR Lifts
              </span>
              
              {buddyPrs.length === 0 ? (
                <div className="bg-[#110e1a] p-4 text-center rounded-2xl text-xs text-neutral-400 font-semibold border border-purple-950/10">
                  No PR lifts logged by this bro yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {buddyPrs.map((pr) => (
                    <div 
                      key={pr.id}
                      className="bg-[#110e1a] p-3 rounded-2xl border border-purple-950/20 flex justify-between items-center text-xs"
                    >
                      <span className="font-extrabold text-white">{pr.exercise}</span>
                      <span className="font-mono text-emerald-400 font-black">
                        {pr.weight} lbs x {pr.reps} reps
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBuddy(null)}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition cursor-pointer select-none"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

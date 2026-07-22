import React, { useState } from 'react';
import { MessageSquare, Plus, X, Search, Check, Send, ArrowLeft, Users, Dumbbell, Sparkles } from 'lucide-react';
import { GroupChat, GroupMessage, GymBuddy, UserProfile } from '../types';

interface ChatsTabProps {
  currentUser: UserProfile;
  buddies: GymBuddy[];
  groups: GroupChat[];
  setGroups: React.Dispatch<React.SetStateAction<GroupChat[]>>;
  groupMessages: GroupMessage[];
  setGroupMessages: React.Dispatch<React.SetStateAction<GroupMessage[]>>;
}

const MOTIVATIONAL_BRO_REPLIES = [
  "Solid work! Light weight baby! 💪",
  "That is huge progress, let's keep crushing it! 🏋️‍♂️",
  "No days off! We show up, we grind, we repeat! 🔥",
  "Pure dedication right there. Proud of you, bro! 👊",
  "Absolutely anabolic! Let's get this lifting chain green! 🚀",
  "Leg day or chest press? Either way, you crushed it! 🦾",
  "Let's gooo! Who is hitting the iron with me tomorrow?",
  "Protein shake is on me after this! Great effort. 🍛"
];

export default function ChatsTab({
  currentUser,
  buddies,
  groups,
  setGroups,
  groupMessages,
  setGroupMessages
}: ChatsTabProps) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Group creation form state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('💪');
  const [selectedBuddyIds, setSelectedBuddyIds] = useState<string[]>([]);
  const [buddySearch, setBuddySearch] = useState('');

  // Active chat state
  const [typedMessage, setTypedMessage] = useState('');

  const activeGroup = groups.find(g => g.id === activeGroupId);
  const activeMessages = groupMessages.filter(m => m.groupId === activeGroupId);

  // Filter buddies list for selection
  const filteredBuddies = buddies.filter(b => 
    b.name.toLowerCase().includes(buddySearch.toLowerCase()) ||
    b.handle.toLowerCase().includes(buddySearch.toLowerCase())
  );

  const toggleBuddySelection = (id: string) => {
    setSelectedBuddyIds(prev => 
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: GroupChat = {
      id: `g-custom-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'Private squad conversation room.',
      icon: newGroupIcon,
      memberIds: ['user-me', ...selectedBuddyIds]
    };

    setGroups(prev => [newGroup, ...prev]);
    
    // Reset forms
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupIcon('💪');
    setSelectedBuddyIds([]);
    setIsCreateOpen(false);
    
    // Auto-enter the newly created chat group!
    setActiveGroupId(newGroup.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeGroupId) return;

    const userMsgText = typedMessage.trim();
    const newUserMessage: GroupMessage = {
      id: `m-user-${Date.now()}`,
      groupId: activeGroupId,
      buddyId: currentUser.id,
      buddyName: currentUser.name,
      buddyAvatarColor: currentUser.avatarColor,
      text: userMsgText,
      timestamp: new Date().toISOString()
    };

    setGroupMessages(prev => [...prev, newUserMessage]);
    setTypedMessage('');

    // Simulate an energetic gymbro response from one of the group members after 1.5 seconds!
    const otherMembers = activeGroup?.memberIds.filter(id => id !== currentUser.id) || [];
    if (otherMembers.length > 0) {
      setTimeout(() => {
        // Pick a random selected member in the group
        const responderId = otherMembers[Math.floor(Math.random() * otherMembers.length)];
        const responderBuddy = buddies.find(b => b.id === responderId);
        
        const responderName = responderBuddy ? responderBuddy.name : 'Gym Bro';
        const responderAvatar = responderBuddy ? responderBuddy.avatarColor : 'bg-red-600 text-white';
        const replyText = MOTIVATIONAL_BRO_REPLIES[Math.floor(Math.random() * MOTIVATIONAL_BRO_REPLIES.length)];

        const automatedReply: GroupMessage = {
          id: `m-reply-${Date.now()}`,
          groupId: activeGroupId,
          buddyId: responderId,
          buddyName: responderName,
          buddyAvatarColor: responderAvatar,
          text: replyText,
          timestamp: new Date().toISOString()
        };

        setGroupMessages(prev => [...prev, automatedReply]);
      }, 1500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950 text-zinc-100 select-none font-sans relative">
      
      {/* 1. CHATS INDEX MODE */}
      {!activeGroupId && !isCreateOpen && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-20 p-4 space-y-4">
          
          {/* Header */}
          <div className="bg-zinc-900/90 p-5 rounded-3xl border-2 border-zinc-800 shadow-md flex items-center justify-between text-left">
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-red-500 tracking-widest block bg-red-600/15 px-2 py-0.5 rounded border border-red-600/30 w-fit mb-1">SECURE CHANNEL</span>
              <h2 className="text-xl font-black text-white font-display tracking-tight uppercase">SQUAD CHATS</h2>
            </div>
            
            <button
              onClick={() => setIsCreateOpen(true)}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition bubble-hover cursor-pointer shadow-lg shadow-red-600/25 border-2 border-red-500/30 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
            >
              <Plus className="w-4.5 h-4.5 stroke-[3]" />
              <span>Assemble Squad</span>
            </button>
          </div>

          {/* Group Chats List */}
          {groups.length === 0 ? (
            <div className="bg-zinc-900 p-8 rounded-3xl border-2 border-zinc-800 text-center space-y-4 py-12 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-red-600/15 flex items-center justify-center mx-auto text-red-500 border-2 border-red-600/30 shadow-md">
                <MessageSquare className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white font-display uppercase tracking-tight">NO SQUAD ROOMS</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto font-medium leading-relaxed">
                  Build private group channels with your custom gymbros to sync routines, schedule workouts, and push daily streaks!
                </p>
              </div>
              
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs px-5 py-3.5 rounded-2xl uppercase tracking-wider transition border-2 border-red-500/30 cursor-pointer shadow-lg shadow-red-600/25"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Assemble First Squad</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest block pl-1 text-left">
                Your Squad Rooms ({groups.length})
              </span>
              {groups.map((group) => {
                const lastMsg = groupMessages.filter(m => m.groupId === group.id).slice(-1)[0];
                return (
                  <div
                    key={group.id}
                    onClick={() => setActiveGroupId(group.id)}
                    className="bg-zinc-900/90 p-4 rounded-2xl border-2 border-zinc-800 hover:border-red-600/50 shadow-sm cursor-pointer transition flex items-center justify-between gap-3 text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-xl shrink-0 border-2 border-zinc-800 group-hover:border-red-600/50 transition shadow-inner">
                        {group.icon}
                      </div>
                      <div className="min-w-0 leading-tight space-y-1">
                        <h4 className="font-black text-white text-sm group-hover:text-red-400 transition truncate">
                          {group.name}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate font-bold">
                          {lastMsg ? `${lastMsg.buddyName}: ${lastMsg.text}` : group.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-[10px] font-black text-zinc-300 font-mono">
                        <Users className="w-3.5 h-3.5 text-red-500 stroke-[2.5]" />
                        <span>{group.memberIds.length}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. CREATE GROUP OVERLAY VIEW */}
      {isCreateOpen && (
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden text-left">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-750 rounded-xl text-zinc-300 cursor-pointer"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
            <h3 className="text-sm font-black font-display text-white uppercase">Assemble Gym Squad</h3>
            <div className="w-8" />
          </div>

          <form onSubmit={handleCreateGroupSubmit} className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            
            {/* Squad Basics */}
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Emoji</label>
                  <select
                    value={newGroupIcon}
                    onChange={(e) => setNewGroupIcon(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl py-3 text-center text-xl outline-none cursor-pointer focus:border-red-600"
                  >
                    <option value="💪">💪</option>
                    <option value="🔥">🔥</option>
                    <option value="🏋️‍♂️">🏋️‍♂️</option>
                    <option value="🏃‍♂️">🏃‍♂️</option>
                    <option value="🥗">🥗</option>
                    <option value="⚡">⚡</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Squad / Group Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5AM Bench Crew"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl py-3 px-3 outline-none font-bold text-white placeholder-zinc-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">Group Slogan / Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Chasing heavy deadlifts & clean macros!"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl py-3 px-3 outline-none font-medium text-white placeholder-zinc-500 text-xs"
                />
              </div>
            </div>

            {/* Friend Search & Selection Box */}
            <div className="flex-1 flex flex-col overflow-hidden space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block pl-1">
                  Search & Add Gym Bros ({selectedBuddyIds.length} Selected)
                </span>
              </div>

              {buddies.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center space-y-2">
                  <span className="text-xl">🤝</span>
                  <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed font-semibold">
                    You haven't added any gym bros yet! Go to the <b className="text-red-400">Profile tab</b> first to add some gym bros, then you can invite them into squads.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-3">
                  {/* Search bar */}
                  <div className="relative mb-2 shrink-0">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search gym bros..."
                      value={buddySearch}
                      onChange={(e) => setBuddySearch(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs outline-none text-white placeholder-zinc-500 font-medium focus:border-red-600"
                    />
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
                    {filteredBuddies.length === 0 ? (
                      <p className="text-center py-4 text-[11px] text-zinc-500">No lifters found with that handle.</p>
                    ) : (
                      filteredBuddies.map(buddy => {
                        const isChecked = selectedBuddyIds.includes(buddy.id);
                        return (
                          <div
                            key={buddy.id}
                            onClick={() => toggleBuddySelection(buddy.id)}
                            className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer border transition ${
                              isChecked 
                                ? 'bg-red-500/15 border-red-500/30 text-white' 
                                : 'bg-zinc-950 border-zinc-850 text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg ${buddy.avatarColor || 'bg-zinc-800 text-white'} flex items-center justify-center text-[10px] font-black`}>
                                {buddy.name[0].toUpperCase()}
                              </div>
                              <div className="text-left leading-tight">
                                <span className="text-[11px] font-extrabold block text-white">{buddy.name}</span>
                                <span className="text-[9px] text-zinc-400 font-mono block">{buddy.handle}</span>
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                              isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-zinc-700 bg-zinc-900'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Assemble button */}
            <button
              type="submit"
              disabled={!newGroupName.trim() || buddies.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl uppercase tracking-wider text-xs shadow-lg shadow-red-600/20 cursor-pointer bubble-hover shrink-0"
            >
              Assemble Squad Chat Room 👊
            </button>
          </form>
        </div>
      )}

      {/* 3. ACTIVE SQUAD MESSAGING PANEL */}
      {activeGroupId && activeGroup && (
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden text-left">
          {/* Active Chat Header */}
          <div className="px-4 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setActiveGroupId(null)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-750 rounded-xl text-zinc-300 cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg">
                {activeGroup.icon}
              </div>
              
              <div className="min-w-0 leading-tight">
                <h4 className="font-extrabold text-white text-sm truncate leading-tight">
                  {activeGroup.name}
                </h4>
                <p className="text-[10px] text-zinc-400 font-medium truncate">
                  {activeGroup.description}
                </p>
              </div>
            </div>

            <div className="text-[10px] font-black text-red-400 font-mono shrink-0">
              {activeGroup.memberIds.length} BROS
            </div>
          </div>

          {/* Messages Scroller */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-zinc-950">
            {activeMessages.length === 0 ? (
              <div className="text-center py-12 space-y-1">
                <p className="text-xs font-black text-red-500 font-display uppercase tracking-widest">Room Activated ⚡</p>
                <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                  Type an update, log a lift, or plan a gym trip. Send a message to start!
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.buddyId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    {/* Senders Name */}
                    <span className="text-[9px] text-zinc-400 font-mono font-bold mb-0.5 px-1">
                      {isMe ? 'You' : msg.buddyName}
                    </span>
                    
                    {/* Balloon */}
                    <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-red-600 text-white rounded-tr-none' 
                        : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Text input footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2 shrink-0 items-center">
            <input
              type="text"
              placeholder="Message squad bros... 👊"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs outline-none text-white placeholder-zinc-500 font-semibold focus:border-red-600"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl cursor-pointer shadow-md shadow-red-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}

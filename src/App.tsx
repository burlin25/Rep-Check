import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, MessageSquare, Flame, User } from 'lucide-react';
import MobileFrame from './components/MobileFrame';
import FeedTab from './components/FeedTab';
import ChatsTab from './components/ChatsTab';
import PostTab from './components/PostTab';
import StreaksTab from './components/StreaksTab';
import ProfileTab from './components/ProfileTab';
import AuthView from './components/AuthView';
import { GymBuddy, WorkoutPost, PersonalPR, UserProfile, GroupChat, GroupMessage } from './types';
import { calculateStreak } from './lib/streak';
import { 
  getSavedAccounts, 
  saveAccounts, 
  getSavedCurrentUser, 
  saveCurrentUser, 
  loadUserData, 
  saveUserData 
} from './lib/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getSavedCurrentUser());
  const [allAccounts, setAllAccounts] = useState<UserProfile[]>(() => getSavedAccounts());

  useEffect(() => {
    saveAccounts(allAccounts);
  }, [allAccounts]);

  const handleSelectAccount = (account: UserProfile) => {
    setCurrentUser(account);
    saveCurrentUser(account);
  };

  const handleRegisterAccount = (newAcc: UserProfile) => {
    setAllAccounts(prev => {
      const filtered = prev.filter(a => a.handle.toLowerCase() !== newAcc.handle.toLowerCase());
      const updated = [...filtered, newAcc];
      saveAccounts(updated);
      return updated;
    });

    setCurrentUser(newAcc);
    saveCurrentUser(newAcc);

    // Initialize clean user data stores
    saveUserData(newAcc.id, 'workout_dates', []);
    saveUserData(newAcc.id, 'posts', []);
    saveUserData(newAcc.id, 'buddies', []);
    saveUserData(newAcc.id, 'prs', []);
    saveUserData(newAcc.id, 'groups', []);
    saveUserData(newAcc.id, 'group_messages', []);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <MobileFrame>
        <AuthView 
          allAccounts={allAccounts}
          onSelectAccount={handleSelectAccount}
          onRegisterAccount={handleRegisterAccount}
        />
      </MobileFrame>
    );
  }

  return (
    <AppInner 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser}
      onLogout={handleLogout} 
      setAllAccounts={setAllAccounts}
    />
  );
}

// --- CORE APP VIEW INNER ---
interface AppInnerProps {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  onLogout: () => void;
  setAllAccounts: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

function AppInner({ currentUser, setCurrentUser, onLogout, setAllAccounts }: AppInnerProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'chats' | 'post' | 'streaks' | 'profile'>('feed');
  const userId = currentUser.id;

  // --- LOCAL PERSISTENT STORAGE ENGAGEMENT ---
  const [buddies, setBuddies] = useState<GymBuddy[]>(() => 
    loadUserData<GymBuddy[]>(userId, 'buddies', [])
  );

  const [posts, setPosts] = useState<WorkoutPost[]>(() => 
    loadUserData<WorkoutPost[]>(userId, 'posts', [])
  );

  const [prs, setPrs] = useState<PersonalPR[]>(() => 
    loadUserData<PersonalPR[]>(userId, 'prs', [])
  );

  const [workoutDates, setWorkoutDates] = useState<string[]>(() => 
    loadUserData<string[]>(userId, 'workout_dates', [])
  );

  const [groups, setGroups] = useState<GroupChat[]>(() => 
    loadUserData<GroupChat[]>(userId, 'groups', [])
  );

  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(() => 
    loadUserData<GroupMessage[]>(userId, 'group_messages', [])
  );

  // Synchronize user state with persistent storage on every change
  useEffect(() => {
    saveUserData(userId, 'buddies', buddies);
  }, [buddies, userId]);

  useEffect(() => {
    saveUserData(userId, 'posts', posts);
  }, [posts, userId]);

  useEffect(() => {
    saveUserData(userId, 'prs', prs);
  }, [prs, userId]);

  useEffect(() => {
    saveUserData(userId, 'workout_dates', workoutDates);
  }, [workoutDates, userId]);

  useEffect(() => {
    saveUserData(userId, 'groups', groups);
  }, [groups, userId]);

  useEffect(() => {
    saveUserData(userId, 'group_messages', groupMessages);
  }, [groupMessages, userId]);

  // Calculate dynamic streak based on active logged workout dates
  const liftingStreak = calculateStreak(workoutDates);

  // Keep the user profile streak synchronized in global context too!
  useEffect(() => {
    if (currentUser.streak !== liftingStreak) {
      const updatedUser = { ...currentUser, streak: liftingStreak };
      setCurrentUser(updatedUser);
      saveCurrentUser(updatedUser);
      
      // Update in accounts roster
      setAllAccounts(prev => prev.map(a => a.id === currentUser.id ? updatedUser : a));
    }
  }, [liftingStreak, currentUser, setCurrentUser, setAllAccounts]);

  // --- ACTIONS ---
  const handlePostCreated = (newPost: WorkoutPost) => {
    setPosts(prev => [newPost, ...prev]);
    
    // Track today's date in workout dates list
    const todayStr = new Date().toISOString().split('T')[0];
    setWorkoutDates(prev => {
      if (prev.includes(todayStr)) return prev;
      return [...prev, todayStr];
    });
  };

  const handleUpdateName = (name: string, handle: string) => {
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim().toLowerCase() : `@${handle.trim().toLowerCase()}`;
    const updated = { ...currentUser, name, handle: cleanHandle };
    setCurrentUser(updated);
    saveCurrentUser(updated);
    
    // Update accounts list
    setAllAccounts(prev => prev.map(a => a.id === currentUser.id ? updated : a));
  };

  const handleFistBump = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const hasFistBumped = !p.hasFistBumped;
        return {
          ...p,
          hasFistBumped,
          fistBumps: hasFistBumped ? p.fistBumps + 1 : Math.max(0, p.fistBumps - 1)
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              buddyId: currentUser.id,
              buddyName: currentUser.name,
              buddyHandle: currentUser.handle,
              text,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return p;
    }));
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        
        {/* ACTIVE VIEW RENDERING PANEL */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'feed' && (
            <FeedTab 
              posts={posts}
              currentUser={currentUser}
              buddies={buddies}
              onAddFistBump={handleFistBump}
              onAddComment={handleAddComment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'chats' && (
            <ChatsTab 
              currentUser={currentUser}
              buddies={buddies}
              groups={groups}
              setGroups={setGroups}
              groupMessages={groupMessages}
              setGroupMessages={setGroupMessages}
            />
          )}

          {activeTab === 'post' && (
            <PostTab 
              currentUser={currentUser}
              onPostCreated={handlePostCreated}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'streaks' && (
            <StreaksTab 
              currentUser={currentUser}
              buddies={buddies}
              liftingStreak={liftingStreak}
              workoutDates={workoutDates}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab 
              prs={prs}
              setPrs={setPrs}
              buddies={buddies}
              setBuddies={setBuddies}
              currentUser={currentUser}
              liftingStreak={liftingStreak}
              onLogout={onLogout}
              onUpdateName={handleUpdateName}
            />
          )}
        </div>

        {/* 5-TAB MODERN NAVIGATION BOTTOM BAR */}
        <div className="bg-zinc-900/90 border-t-2 border-zinc-800 px-3 py-3 flex justify-between items-center z-40 select-none relative font-sans shrink-0 backdrop-blur-md">
          
          {/* 1. Feed */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'feed'
                ? 'text-red-500 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] tracking-tight font-black uppercase">Feed</span>
          </button>

          {/* 2. Chats */}
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'chats'
                ? 'text-red-500 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] tracking-tight font-black uppercase">Chats</span>
          </button>

          {/* 3. Post - Prominent Centered Action Button */}
          <div className="relative px-3 flex justify-center shrink-0">
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center justify-center -mt-8 w-13 h-13 rounded-2xl transition shadow-lg border-4 border-zinc-950 z-50 cursor-pointer bubble-hover ${
                activeTab === 'post'
                  ? 'bg-red-600 text-white shadow-red-600/40 border-red-500/50'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-800'
              }`}
              title="Post Gym Update"
            >
              <Plus className="w-6.5 h-6.5 stroke-[3.5]" />
            </button>
          </div>

          {/* 4. Streaks */}
          <button
            onClick={() => setActiveTab('streaks')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'streaks'
                ? 'text-red-500 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] tracking-tight font-black uppercase">Streaks</span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-red-500 font-black'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[9px] tracking-tight font-black uppercase">Profile</span>
          </button>

        </div>

      </div>
    </MobileFrame>
  );
}

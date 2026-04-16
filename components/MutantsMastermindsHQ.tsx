import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, BarChart3, Target, Image, Settings, Sparkles, 
  Trophy, Bell, Shield, Zap, Sword, Eye, Star, Crown,
  Calendar, MapPin, Clock, Award, Heart, MessageCircle,
  Share2, Plus, Search, Filter, TrendingUp, Users2,
  BookOpen, Gamepad2, Palette, Camera, Download, RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mutantsMastermindsService, MAndMCharacter, MAndMCampaign, MAndMStats } from '../services/mutantsMastermindsService';
import { mnmCommunityService, MAndMCommunityPost, MAndMEvent, MAndMChallenge } from '../services/mnmCommunityService';
import { notificationService } from '../services/notificationService';

type TabType = 'dashboard' | 'characters' | 'campaigns' | 'community' | 'events' | 'gallery' | 'achievements' | 'settings';

const MutantsMastermindsHQ: React.FC = () => {
  const headerPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
  const heroPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // M&M specific state
  const [characters, setCharacters] = useState<MAndMCharacter[]>([]);
  const [campaigns, setCampaigns] = useState<MAndMCampaign[]>([]);
  const [userStats, setUserStats] = useState<MAndMStats | null>(null);
  const [communityPosts, setCommunityPosts] = useState<MAndMCommunityPost[]>([]);
  const [activeEvents, setActiveEvents] = useState<MAndMEvent[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<MAndMChallenge[]>([]);

  // Load M&M data
  const loadMAndMData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [
        charactersData,
        campaignsData,
        statsData,
        postsData,
        eventsData,
        challengesData
      ] = await Promise.all([
        mutantsMastermindsService.getCharacters(user.id),
        mutantsMastermindsService.getCampaigns(user.id),
        mutantsMastermindsService.getUserStats(user.id),
        mnmCommunityService.getCommunityFeed(user.id, 1, 10),
        mnmCommunityService.getActiveEvents(),
        mnmCommunityService.getActiveChallenges()
      ]);

      setCharacters(charactersData);
      setCampaigns(campaignsData);
      setUserStats(statsData);
      setCommunityPosts(postsData);
      setActiveEvents(eventsData);
      setActiveChallenges(challengesData);
      setLastSync(new Date());
    } catch (error) {
      console.error('Error loading M&M data:', error);
      notificationService.showNotification('Error', 'Failed to load headquarters data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMAndMData();
  }, [loadMAndMData]);

  const syncData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        mutantsMastermindsService.syncData(user.id),
        loadMAndMData()
      ]);
      notificationService.showNotification('Success', 'Data synchronized successfully', 'success');
    } catch (error) {
      console.error('Error syncing data:', error);
      notificationService.showNotification('Error', 'Failed to sync data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, loadMAndMData]);

  const getPowerLevelColor = (level: number) => {
    if (level >= 15) return 'text-purple-400';
    if (level >= 12) return 'text-red-400';
    if (level >= 10) return 'text-orange-400';
    if (level >= 8) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getArchetypeIcon = (archetype: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'STRONG': <Shield className="w-4 h-4" />,
      'JUSTICIERO': <Sword className="w-4 h-4" />,
      'SPEEDSTER': <Zap className="w-4 h-4" />,
      'MYSTIC': <Eye className="w-4 h-4" />,
      'TECH': <Gamepad2 className="w-4 h-4" />,
      'PARAGON': <Crown className="w-4 h-4" />,
      'ENERGY_PRO': <Star className="w-4 h-4" />,
      'WEAPON_MASTER': <Sword className="w-4 h-4" />,
      'SHAPESHIFTER': <Palette className="w-4 h-4" />,
      'MENTALIST': <Eye className="w-4 h-4" />,
      'GADGETEER': <Gamepad2 className="w-4 h-4" />,
      'MONSTER': <Shield className="w-4 h-4" />,
      'ELEMENTAL': <Zap className="w-4 h-4" />,
      'CONSTRUCT': <Gamepad2 className="w-4 h-4" />,
      'BLASTER': <Star className="w-4 h-4" />,
      'TRICKSTER': <Palette className="w-4 h-4" />,
      'CONTROLLER': <Eye className="w-4 h-4" />,
      'SUMMONER': <Eye className="w-4 h-4" />,
      'ANTIHERO': <Sword className="w-4 h-4" />
    };
    return icons[archetype] || <Star className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
             {/* Superhero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-red-900/80 border-b border-blue-500/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: headerPattern }}></div>
        
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                  SUPERHERO HQ
                </h1>
                <span className="text-sm text-blue-300">M&M Edition</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastSync && (
                <div className="text-sm text-blue-300">
                  Last sync: {lastSync.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={syncData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600/50 hover:bg-blue-600/70 rounded-lg border border-blue-500/30 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      </header>

             {/* Navigation */}
      <nav className="bg-slate-800/50 border-b border-slate-700/50">
        <div className="px-6 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'characters', label: 'Characters', icon: Users },
              { id: 'campaigns', label: 'Campaigns', icon: Target },
              { id: 'community', label: 'Community', icon: Users2 },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'gallery', label: 'Gallery', icon: Image },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600/50 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

             {/* Main Content */}
      <main className="p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Welcome */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-red-900/40 border border-blue-500/30 p-8">
              <div className="absolute inset-0" style={{ backgroundImage: heroPattern }}></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Welcome, Commander!
                    </h2>
                    <p className="text-blue-300">
                      Your superhero headquarters is ready for action
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                {userStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-slate-300">Characters</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userStats.totalCharacters}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-slate-300">Campaigns</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userStats.activeCampaigns}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-slate-300">Experience</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userStats.totalExperience.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-slate-300">Achievements</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userStats.achievementsUnlocked}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Characters */}
            {characters.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 border border-green-500/30 p-8">
                <h3 className="text-xl font-bold text-green-300 mb-6">Active Heroes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {characters.filter(c => c.isActive).slice(0, 6).map((character) => (
                    <div key={character.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-green-500/50 transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          {getArchetypeIcon(character.archetype)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{character.name}</h4>
                          <p className="text-sm text-slate-300">{character.archetype}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${getPowerLevelColor(character.powerLevel)}`}>
                          PL {character.powerLevel}
                        </span>
                        <span className="text-xs text-slate-400">
                          {character.experience} XP
                        </span>
                      </div>
                      
                      {character.faction && (
                        <div className="mt-2">
                          <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                            {character.faction}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Campaigns */}
            {campaigns.filter(c => c.status === 'active').length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/40 via-red-900/40 to-pink-900/40 border border-orange-500/30 p-8">
                <h3 className="text-xl font-bold text-orange-300 mb-6">Active Campaigns</h3>
                <div className="space-y-4">
                  {campaigns.filter(c => c.status === 'active').slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{campaign.name}</h4>
                        <span className="text-sm text-orange-300">PL {campaign.powerLevel}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{campaign.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span>{campaign.sessions.length} sessions</span>
                        <span>{campaign.players.length} players</span>
                        {campaign.nextSession && (
                          <span>Next: {campaign.nextSession.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Feed */}
            {communityPosts.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-indigo-500/30 p-8">
                <h3 className="text-xl font-bold text-indigo-300 mb-6">Community Activity</h3>
                <div className="space-y-4">
                  {communityPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{post.userName.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{post.title}</h4>
                          <p className="text-xs text-slate-400">by {post.userName}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{post.content.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share2 className="w-3 h-3" />
                          <span>{post.shares}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

                 {/* Placeholder for other tabs */}
        {activeTab !== 'dashboard' && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
              </h3>
              <p className="text-slate-400">
                This section is under development for the M&M Headquarters
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MutantsMastermindsHQ; 

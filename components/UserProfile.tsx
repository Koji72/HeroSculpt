import React, { useState, useEffect, useRef } from 'react';
import { UserConfigService } from '../services/userConfigService';
import { UserConfiguration } from '../lib/supabase';
import { SelectedParts } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Trash2, 
  Download, 
  User, 
  LogOut, 
  Settings, 
  BookOpen, 
  History, 
  Star,
  ChevronRight,
  ChevronDown,
  Shield,
  Zap,
  Palette,
  FileText,
  HelpCircle,
  Bell,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Crown,
  Trophy,
  Sword,
  Target,
  Flame,
  Sparkles,
  Heart,
  Eye,
  Brain,
  Plus
} from 'lucide-react';
import UserSettings from './UserSettings';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConfiguration: (parts: SelectedParts, modelName?: string) => void;
  onSignOut: () => Promise<void>;
  onOpenPurchaseLibrary?: () => void;
  isAuthenticated: boolean;
  user: any;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

type ActiveTab = 'overview' | 'library' | 'configurations' | 'settings' | 'help';

const UserProfile: React.FC<UserProfileProps> = ({
  isOpen,
  onClose,
  onLoadConfiguration,
  onSignOut,
  onOpenPurchaseLibrary,
  isAuthenticated,
  user,
  id,
  registerElement
}) => {
  const [configurations, setConfigurations] = useState<UserConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement, isOpen]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserConfigurations();
    }
  }, [isAuthenticated, user]);

  const loadUserConfigurations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const configs = await UserConfigService.getUserConfigurations();
      setConfigurations(configs);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfiguration = async (configId: string) => {
    const success = await UserConfigService.deleteConfiguration(configId);
    if (success) {
      setConfigurations(prev => prev.filter(config => config.id !== configId));
    }
  };

  const handleLoadConfiguration = (config: UserConfiguration) => {
    onLoadConfiguration(config.selected_parts, config.name);
  };

  const handleSignOutAndClose = async () => {
    await onSignOut();
    onClose();
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isSectionExpanded = (section: string) => expandedSections.has(section);

  // Hero stats calculation
  const heroLevel = Math.floor(configurations.length / 5) + 1;
  const heroXP = configurations.length * 100;
  const nextLevelXP = heroLevel * 500;
  const xpProgress = (heroXP % 500) / 500;

  if (!isAuthenticated) {
    return isOpen ? (
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="panel-box" style={{ width: 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="panel-header">
            <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>PROFILE</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
          </div>
          <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Shield style={{ width: 48, height: 48, color: 'var(--color-accent)' }} />
              <h3 style={{ fontFamily: 'var(--font-comic)', fontSize: 20, letterSpacing: 2, color: 'var(--color-text)' }}>JOIN THE LEAGUE!</h3>
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                Create, save, and manage your epic superhero configurations
              </p>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                <div style={{ marginBottom: 6 }}>• Save unlimited configurations</div>
                <div style={{ marginBottom: 6 }}>• Access your purchase library</div>
                <div>• Become a legendary hero</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Hero Profile Card */}
      <Card className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            {/* Hero Avatar */}
            <div className="relative">
                              <div className="w-20 h-20 from-purple-500 flex shadow-lg shadow-purple-500/50 relative bg-gradient-to-r via-blue-500 to-cyan-500 rounded-full items-center justify-center">
                  <Crown className="h-10 w-10 text-white" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                    {heroLevel}
                  </div>
                </div>
                              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>
            
            {/* Hero Info */}
            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-white">{user?.email}</h2>
                  <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-xs font-bold text-white">
                    Level {heroLevel}
                  </div>
                </div>
              <p className="text-slate-300 text-sm mb-4">
                Member since {new Date(user?.created_at ?? Date.now()).toLocaleDateString()}
              </p>
              
              {/* XP Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Experience: {heroXP} XP</span>
                  <span>Next level: {nextLevelXP} XP</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full transition-colors transition-transform transition-shadow duration-200"
                    style={{ width: `${xpProgress * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{configurations.length}</div>
                  <div className="text-xs text-slate-400">Configurations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-slate-400">Purchases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">5</div>
                  <div className="text-xs text-slate-400">Favorites</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Powers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="from-red-900/30 bg-gradient-to-br to-red-800/20 border-red-500/30 hover:border-red-400/50 transition-colors transition-transform transition-shadow duration-150 group">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 from-red-500 flex group-hover:scale-[1.05] bg-gradient-to-r to-orange-500 rounded-full transition-transform duration-150 items-center justify-center mx-auto mb-3">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-red-400">Fire</div>
            <div className="text-xs text-red-300">Elemental Power</div>
          </CardContent>
        </Card>
        
        <Card className="from-blue-900/30 bg-gradient-to-br to-blue-800/20 border-blue-500/30 hover:border-blue-400/50 transition-colors transition-transform transition-shadow duration-150 group">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 from-blue-500 flex group-hover:scale-[1.05] bg-gradient-to-r to-cyan-500 rounded-full transition-transform duration-150 items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-blue-400">Rays</div>
            <div className="text-xs text-blue-300">Electric Power</div>
          </CardContent>
        </Card>
        
        <Card className="from-purple-900/30 bg-gradient-to-br to-purple-800/20 border-purple-500/30 hover:border-purple-400/50 transition-colors transition-transform transition-shadow duration-150 group">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 from-purple-500 flex group-hover:scale-[1.05] bg-gradient-to-r to-pink-500 rounded-full transition-transform duration-150 items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-purple-400">Telepathy</div>
            <div className="text-xs text-purple-300">Mental Power</div>
          </CardContent>
        </Card>
        
        <Card className="from-green-900/30 bg-gradient-to-br to-green-800/20 border-green-500/30 hover:border-green-400/50 transition-colors transition-transform transition-shadow duration-150 group">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 from-green-500 flex group-hover:scale-[1.05] bg-gradient-to-r to-emerald-500 rounded-full transition-transform duration-150 items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-green-400">Defense</div>
            <div className="text-xs text-green-300">Protector Power</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Hero Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onOpenPurchaseLibrary}
            className="w-full from-purple-600 hover:from-purple-500 bg-gradient-to-r to-blue-600 hover:to-blue-500 text-white text-lg transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] font-bold py-4"
          >
            <BookOpen className="h-5 w-5 mr-3" />
            📚 My Purchase Library
          </Button>
          
          <Button
            onClick={() => setActiveTab('configurations')}
            variant="outline"
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 text-lg transition-colors transition-transform transition-shadow duration-150 py-4"
          >
            <Palette className="h-5 w-5 mr-3" />
            My Hero Configurations
          </Button>
          
          <Button
            onClick={() => setActiveTab('settings')}
            variant="outline"
            className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 text-lg transition-colors transition-transform transition-shadow duration-150 py-4"
          >
            <Settings className="h-5 w-5 mr-3" />
            ⚙️ Hero Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="h-6 w-6 text-cyan-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">New configuration created</div>
              <div className="text-slate-400 text-sm">2 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Model 3D downloaded</div>
              <div className="text-slate-400 text-sm">1 day ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Configuration marked as favorite</div>
              <div className="text-slate-400 text-sm">3 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfigurations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Palette className="h-6 w-6 text-purple-400" />
          My Hero Configurations
        </h2>
        <div className="text-slate-400 text-sm">
          {configurations.length} configurations saved
        </div>
      </div>

              {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading configurations...</p>
                </div>
              ) : configurations.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Create your first configuration!</h3>
            <p className="text-slate-400 mb-6">
              Design your personalized superhero and save it for later
              </p>
              <Button
                onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Hero
              </Button>
          </CardContent>
        </Card>
              ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {configurations.map((config) => (
            <Card key={config.id} className="from-slate-800 bg-gradient-to-br to-slate-900 border-slate-700 hover:border-purple-500/50 transition-colors transition-transform transition-shadow duration-150 group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {config.name || 'Unnamed Configuration'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Created on {new Date(config.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoadConfiguration(config)}
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                        >
                      <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                      variant="outline"
                          onClick={() => handleDeleteConfiguration(config.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">
                      {Object.keys(config.selected_parts).length} parts configured
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300">
                      Last modification: {new Date(config.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="h-10 w-10 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Hero Help Center</h2>
        <p className="text-slate-400">
          Everything you need to know to become a master of superhero design
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              First Steps
          </CardTitle>
        </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                1
              </div>
              <div>
                <div className="text-white font-medium">Select your archetype</div>
                <div className="text-slate-400 text-sm">Choose between Strong or Justiciero</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                2
              </div>
              <div>
                <div className="text-white font-medium">Personalize each part</div>
                <div className="text-slate-400 text-sm">From head to boots</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                3
              </div>
              <div>
                <div className="text-white font-medium">Save your configuration</div>
                <div className="text-slate-400 text-sm">Access it whenever you want</div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                💡
              </div>
              <div>
                <div className="text-white font-medium">Use the preview</div>
                <div className="text-slate-400 text-sm">Hover over parts to see them</div>
                </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                🎯
              </div>
              <div>
                <div className="text-white font-medium">Compatible combinations</div>
                <div className="text-slate-400 text-sm">Some parts only work together</div>
                </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                ⚡
              </div>
              <div>
                <div className="text-white font-medium">Export your hero</div>
                <div className="text-slate-400 text-sm">Download as GLB or STL</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-400" />
            Advanced Functions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <Download className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-white font-medium">3D Export</div>
            <div className="text-slate-400 text-sm">GLB and STL</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-white font-medium">Library</div>
            <div className="text-slate-400 text-sm">Saved purchases</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <Settings className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-white font-medium">Configuration</div>
            <div className="text-slate-400 text-sm">Personalization</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'configurations':
        return renderConfigurations();
      case 'help':
        return renderHelp();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onClose}
        >
          <div
            className="panel-box"
            style={{ width: '95vw', maxWidth: 900, height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>PROFILE</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'var(--color-surface)' }}>
            {/* Sidebar */}
            <div style={{ width: 200, borderRight: '1.5px solid var(--color-border-strong)', padding: 12, display: 'flex', flexDirection: 'column', background: 'var(--color-surface-2)', flexShrink: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2, color: 'var(--color-text)', marginBottom: 4 }}>HERO PROFILE</h1>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Manage your superhero identity</p>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', textAlign: 'left', background: activeTab === 'overview' ? 'var(--color-accent)' : 'transparent', color: activeTab === 'overview' ? '#000' : 'var(--color-text)' }}
                >
                  <User style={{ width: 14, height: 14 }} />
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab('configurations')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', textAlign: 'left', background: activeTab === 'configurations' ? 'var(--color-accent)' : 'transparent', color: activeTab === 'configurations' ? '#000' : 'var(--color-text)' }}
                >
                  <Palette style={{ width: 14, height: 14 }} />
                  Configurations
                </button>

                <button
                  onClick={() => setActiveTab('help')}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', textAlign: 'left', background: activeTab === 'help' ? 'var(--color-accent)' : 'transparent', color: activeTab === 'help' ? '#000' : 'var(--color-text)' }}
                >
                  <HelpCircle style={{ width: 14, height: 14 }} />
                  Help
                </button>
              </nav>

              <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--color-border-strong)' }}>
                <button
                  onClick={handleSignOutAndClose}
                  style={{ width: '100%', padding: '8px 10px', background: 'transparent', border: '1.5px solid #ef4444', borderRadius: 'var(--radius)', color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <LogOut style={{ width: 12, height: 12 }} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--color-surface)' }}>
              <div ref={ref} style={{ height: '100%' }}>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {isSettingsOpen && (
          <UserSettings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            user={user}
          />
        )}
      </div>
    )}
    </>
  );
};

export default UserProfile; 
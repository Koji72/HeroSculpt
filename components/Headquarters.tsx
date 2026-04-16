import React, { useEffect, useMemo, useState } from 'react';
import { ArchetypeId, SelectedParts } from '../types';
import { headquartersService } from '../services/headquartersService';
import { notificationService } from '../services/notificationService';
import { gamificationService } from '../services/gamificationService';
import { externalAPIService } from '../services/externalAPIService';
import { useAuth } from '../hooks/useAuth';
import './Headquarters.css';

type HeadquartersTab =
  | 'Dashboard'
  | 'Characters'
  | 'AI Lab'
  | 'Missions'
  | 'Gallery'
  | 'Achievements'
  | 'Notifications'
  | 'Analytics'
  | 'Settings';

interface HeadquartersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId;
  onOpenCharacterSheet: () => void;
  onOpenCustomizer: () => void;
  onOpenRPGSheet: () => void;
  onOpenVTT: () => void;
  onOpenMaterials: () => void;
  onOpenCart: () => void;
}

const tabs: HeadquartersTab[] = [
  'Dashboard',
  'Characters',
  'AI Lab',
  'Missions',
  'Gallery',
  'Achievements',
  'Notifications',
  'Analytics',
  'Settings',
];

const achievementFilters = ['all', 'common', 'rare', 'epic', 'legendary'];
const notificationFilters = ['all', 'achievement', 'mission', 'system', 'character'];

const Headquarters: React.FC<HeadquartersProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HeadquartersTab>('Dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadData = async () => {
    if (!user?.id) return;

    const [hqData, userStats, userAchievements, userNotifications] = await Promise.all([
      headquartersService.getHeadquartersData(user.id),
      gamificationService.getUserStats(user.id),
      gamificationService.getUserAchievements(user.id),
      notificationService.getNotifications(user.id),
    ]);

    setStats({
      ...hqData?.stats,
      ...userStats,
    });
    setAchievements(userAchievements || []);
    setNotifications(userNotifications || []);
  };

  useEffect(() => {
    if (!isOpen) return;

    void loadData();

    const listener = () => {
      void loadData();
    };
    notificationService.addListener(listener);
    return () => {
      notificationService.removeListener(listener);
    };
  }, [isOpen, user?.id]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await externalAPIService.sendAnalytics({ event: 'headquarters_sync', userId: user?.id });
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  const dashboardStats = useMemo(
    () => [
      { label: 'Level', value: stats?.level ? `Level ${stats.level}` : 'Level 1' },
      { label: 'Rank', value: stats?.rank || 'Rookie' },
      { label: 'Roster', value: String(stats?.charactersCreated || stats?.totalCharacters || 0) },
      { label: 'Unlocked', value: String(stats?.achievementsUnlocked || stats?.achievements || 0) },
    ],
    [stats]
  );

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.88)', color: '#fff', zIndex: 120 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 24 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0 }}>SUPERHERO HEADQUARTERS</h1>
            <p style={{ margin: '6px 0 0', color: '#cbd5e1' }}>Command Center - Mission Control</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button aria-label="sync" onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
            <button aria-label="close hq" onClick={onClose}>
              Close HQ
            </button>
          </div>
        </header>

        <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Dashboard' && (
          <section>
            <h2>CHARACTER STATUS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 240px))', gap: 12 }}>
              {dashboardStats.map((item) => (
                <div key={item.label} style={{ border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
                  <strong>{item.value}</strong>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Achievements' && (
          <section>
            <h2>ACHIEVEMENTS</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {achievementFilters.map((filter) => (
                <span key={filter}>{filter}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {achievements.length === 0 ? (
                <p>No achievements yet.</p>
              ) : (
                achievements.map((achievement) => (
                  <article key={achievement.id} style={{ border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
                    <strong>{achievement.name}</strong>
                    <p>{achievement.description}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'Notifications' && (
          <section>
            <h2>NOTIFICATIONS</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {notificationFilters.map((filter) => (
                <span key={filter}>{filter}</span>
              ))}
            </div>
            {notifications.length === 0 ? (
              <>
                <p>No Notifications</p>
                <p>You're all caught up! New notifications will appear here.</p>
              </>
            ) : (
              notifications.map((notification) => (
                <article key={notification.id} style={{ border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </article>
              ))
            )}
          </section>
        )}

        {activeTab !== 'Dashboard' && activeTab !== 'Achievements' && activeTab !== 'Notifications' && (
          <section>
            <h2>{activeTab.toUpperCase()}</h2>
          </section>
        )}
      </div>
    </div>
  );
};

export default Headquarters;

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Headquarters from '../components/Headquarters';
import { SelectedParts, ArchetypeId } from '../types';

// Mock all services
vi.mock('../services/headquartersService', () => ({
  headquartersService: {
    getHeadquartersData: vi.fn(() => Promise.resolve({
      characters: [],
      missions: [],
      galleryHeroes: [],
      stats: {
        totalCharacters: 0,
        totalPowerLevel: 0,
        averageCompatibility: 0,
        totalValue: 0,
        recentActivity: 0,
        achievements: 0
      }
    })),
    clearCache: vi.fn()
  }
}));

vi.mock('../services/notificationService', () => ({
  notificationService: {
    getNotifications: vi.fn(() => Promise.resolve([])),
    addListener: vi.fn(),
    removeListener: vi.fn()
  }
}));

vi.mock('../services/gamificationService', () => ({
  gamificationService: {
    getUserStats: vi.fn(() => Promise.resolve({
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      totalPoints: 0,
      achievementsUnlocked: 0,
      charactersCreated: 0,
      missionsCompleted: 0,
      galleryShares: 0,
      consecutiveDays: 0,
      rank: 'Rookie'
    })),
    getUserAchievements: vi.fn(() => Promise.resolve([])),
    updateConsecutiveDays: vi.fn(() => Promise.resolve())
  }
}));

vi.mock('../services/externalAPIService', () => ({
  externalAPIService: {
    sendAnalytics: vi.fn(() => Promise.resolve())
  }
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

// Mock CSS imports
vi.mock('../components/Headquarters.css', () => ({}));

describe('Headquarters Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedParts: {} as SelectedParts,
    selectedArchetype: ArchetypeId.STRONG,
    onOpenCharacterSheet: vi.fn(),
    onOpenCustomizer: vi.fn(),
    onOpenRPGSheet: vi.fn(),
    onOpenVTT: vi.fn(),
    onOpenMaterials: vi.fn(),
    onOpenCart: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render headquarters when open', () => {
    render(<Headquarters {...defaultProps} />);
    
    expect(screen.getByText('SUPERHERO HEADQUARTERS')).toBeInTheDocument();
    expect(screen.getByText('Command Center - Mission Control')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<Headquarters {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('SUPERHERO HEADQUARTERS')).not.toBeInTheDocument();
  });

  it('should display navigation tabs', () => {
    render(<Headquarters {...defaultProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByText('AI Lab')).toBeInTheDocument();
    expect(screen.getByText('Missions')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should switch to achievements tab when clicked', async () => {
    render(<Headquarters {...defaultProps} />);
    
    const achievementsTab = screen.getByText('Achievements');
    fireEvent.click(achievementsTab);
    
    await waitFor(() => {
      expect(screen.getByText('ACHIEVEMENTS')).toBeInTheDocument();
    });
  });

  it('should switch to notifications tab when clicked', async () => {
    render(<Headquarters {...defaultProps} />);
    
    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);
    
    await waitFor(() => {
      expect(screen.getByText('NOTIFICATIONS')).toBeInTheDocument();
    });
  });

  it('should display sync button', () => {
    render(<Headquarters {...defaultProps} />);
    
    const syncButton = screen.getByRole('button', { name: /sync/i });
    expect(syncButton).toBeInTheDocument();
  });

  it('should display close button', () => {
    render(<Headquarters {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close hq/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Headquarters {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close hq/i });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should display dashboard content by default', async () => {
    render(<Headquarters {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('CHARACTER STATUS')).toBeInTheDocument();
    });
  });

  it('should display user stats when available', async () => {
    const { gamificationService } = await import('../services/gamificationService');
    vi.mocked(gamificationService.getUserStats).mockResolvedValue({
      level: 5,
      experience: 1250,
      experienceToNextLevel: 1500,
      totalPoints: 500,
      achievementsUnlocked: 3,
      charactersCreated: 8,
      missionsCompleted: 12,
      galleryShares: 2,
      consecutiveDays: 7,
      rank: 'Hero'
    });

    render(<Headquarters {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Level 5')).toBeInTheDocument();
      expect(screen.getByText('Hero')).toBeInTheDocument();
    });
  });

  it('should display achievements grid when on achievements tab', async () => {
    const { gamificationService } = await import('../services/gamificationService');
    vi.mocked(gamificationService.getUserAchievements).mockResolvedValue([
      {
        id: 1,
        name: 'First Hero',
        description: 'Create your first hero',
        points: 50,
        rarity: 'common',
        requirement: { type: 'characters_created', target: 1 }
      }
    ]);

    render(<Headquarters {...defaultProps} />);
    
    const achievementsTab = screen.getByText('Achievements');
    fireEvent.click(achievementsTab);
    
    await waitFor(() => {
      expect(screen.getByText('First Hero')).toBeInTheDocument();
      expect(screen.getByText('Create your first hero')).toBeInTheDocument();
    });
  });

  it('should display notifications list when on notifications tab', async () => {
    const { notificationService } = await import('../services/notificationService');
    vi.mocked(notificationService.getNotifications).mockResolvedValue([
      {
        id: '1',
        userId: 'test-user',
        type: 'achievement',
        title: 'Achievement Unlocked',
        message: 'You unlocked First Hero achievement',
        priority: 'normal',
        isRead: false,
        actionUrl: '/achievements',
        createdAt: new Date().toISOString()
      }
    ]);

    render(<Headquarters {...defaultProps} />);
    
    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Achievement Unlocked')).toBeInTheDocument();
      expect(screen.getByText('You unlocked First Hero achievement')).toBeInTheDocument();
    });
  });

  it('should handle sync button click', async () => {
    render(<Headquarters {...defaultProps} />);
    
    const syncButton = screen.getByRole('button', { name: /sync/i });
    fireEvent.click(syncButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(syncButton).toBeDisabled();
    });
  });

  it('should display empty state for notifications', async () => {
    const { notificationService } = await import('../services/notificationService');
    vi.mocked(notificationService.getNotifications).mockResolvedValue([]);

    render(<Headquarters {...defaultProps} />);
    
    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);
    
    await waitFor(() => {
      expect(screen.getByText('No Notifications')).toBeInTheDocument();
      expect(screen.getByText("You're all caught up! New notifications will appear here.")).toBeInTheDocument();
    });
  });

  it('should display achievement categories', async () => {
    render(<Headquarters {...defaultProps} />);
    
    const achievementsTab = screen.getByText('Achievements');
    fireEvent.click(achievementsTab);
    
    await waitFor(() => {
      expect(screen.getByText('all')).toBeInTheDocument();
      expect(screen.getByText('common')).toBeInTheDocument();
      expect(screen.getByText('rare')).toBeInTheDocument();
      expect(screen.getByText('epic')).toBeInTheDocument();
      expect(screen.getByText('legendary')).toBeInTheDocument();
    });
  });

  it('should display notification filters', async () => {
    render(<Headquarters {...defaultProps} />);
    
    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);
    
    await waitFor(() => {
      expect(screen.getByText('all')).toBeInTheDocument();
      expect(screen.getByText('achievement')).toBeInTheDocument();
      expect(screen.getByText('mission')).toBeInTheDocument();
      expect(screen.getByText('system')).toBeInTheDocument();
      expect(screen.getByText('character')).toBeInTheDocument();
    });
  });
}); 
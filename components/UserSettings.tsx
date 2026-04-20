import React, { useState } from 'react';
import { useLang, t, TransKey } from '../lib/i18n';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Settings, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun, 
  Bell, 
  User,
  Shield, 
  CreditCard, 
  Globe, 
  Palette,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Zap,
  Gift,
  RefreshCw,
  Mail,
  BarChart3,
  Database,
  FileText,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
}

interface SettingOption {
  id: string;
  label: TransKey;
  description: TransKey;
  type: 'toggle' | 'select' | 'input' | 'button';
  value: string | boolean | number;
  options?: { label: string; value: string | boolean | number }[];
  icon?: React.ReactNode;
  example?: TransKey;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const { lang } = useLang();
  const [settings, setSettings] = useState({
    // Display Settings
    darkMode: true,
    responsiveDesign: true,
    animations: true,
    highContrast: false,
    
    // Notification Settings
    newParts: true,
    specialOffers: false,
    systemUpdates: true,
    emailNotifications: true,
    
    // Account Settings
    twoFactorAuth: false,
    autoSave: true,
    dataCollection: false,
    
    // Performance Settings
    autoOptimization: true,
    cacheEnabled: true,
    compressionEnabled: true,
    
    // Language Settings
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Accessibility Settings
    screenReader: false,
    largeText: false,
    reducedMotion: false,
    colorBlindMode: false
  });

  const [activeTab, setActiveTab] = useState('display');
  const [showExamples, setShowExamples] = useState<Set<string>>(new Set());

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleExample = (section: string) => {
    const newExamples = new Set(showExamples);
    if (newExamples.has(section)) {
      newExamples.delete(section);
    } else {
      newExamples.add(section);
    }
    setShowExamples(newExamples);
  };

  const displaySettings: SettingOption[] = [
    {
      id: 'darkMode',
      label: 'settings.display.darkMode.label',
      description: 'settings.display.darkMode.desc',
      type: 'toggle',
      value: settings.darkMode,
      icon: <Moon className="h-4 w-4" />,
      example: 'settings.display.darkMode.example'
    },
    {
      id: 'responsiveDesign',
      label: 'settings.display.responsiveDesign.label',
      description: 'settings.display.responsiveDesign.desc',
      type: 'toggle',
      value: settings.responsiveDesign,
      icon: <Smartphone className="h-4 w-4" />,
      example: 'settings.display.responsiveDesign.example'
    },
    {
      id: 'animations',
      label: 'settings.display.animations.label',
      description: 'settings.display.animations.desc',
      type: 'toggle',
      value: settings.animations,
      icon: <Zap className="h-4 w-4" />,
      example: 'settings.display.animations.example'
    },
    {
      id: 'highContrast',
      label: 'settings.display.highContrast.label',
      description: 'settings.display.highContrast.desc',
      type: 'toggle',
      value: settings.highContrast,
      icon: <Eye className="h-4 w-4" />,
      example: 'settings.display.highContrast.example'
    }
  ];

  const notificationSettings: SettingOption[] = [
    {
      id: 'newParts',
      label: 'settings.notifications.newParts.label',
      description: 'settings.notifications.newParts.desc',
      type: 'toggle',
      value: settings.newParts,
      icon: <Bell className="h-4 w-4" />,
      example: 'settings.notifications.newParts.example'
    },
    {
      id: 'specialOffers',
      label: 'settings.notifications.specialOffers.label',
      description: 'settings.notifications.specialOffers.desc',
      type: 'toggle',
      value: settings.specialOffers,
      icon: <Gift className="h-4 w-4" />,
      example: 'settings.notifications.specialOffers.example'
    },
    {
      id: 'systemUpdates',
      label: 'settings.notifications.systemUpdates.label',
      description: 'settings.notifications.systemUpdates.desc',
      type: 'toggle',
      value: settings.systemUpdates,
      icon: <RefreshCw className="h-4 w-4" />,
      example: 'settings.notifications.systemUpdates.example'
    },
    {
      id: 'emailNotifications',
      label: 'settings.notifications.emailNotifications.label',
      description: 'settings.notifications.emailNotifications.desc',
      type: 'toggle',
      value: settings.emailNotifications,
      icon: <Mail className="h-4 w-4" />,
      example: 'settings.notifications.emailNotifications.example'
    }
  ];

  const accountSettings: SettingOption[] = [
    {
      id: 'twoFactorAuth',
      label: 'settings.account.twoFactorAuth.label',
      description: 'settings.account.twoFactorAuth.desc',
      type: 'toggle',
      value: settings.twoFactorAuth,
      icon: <Shield className="h-4 w-4" />,
      example: 'settings.account.twoFactorAuth.example'
    },
    {
      id: 'autoSave',
      label: 'settings.account.autoSave.label',
      description: 'settings.account.autoSave.desc',
      type: 'toggle',
      value: settings.autoSave,
      icon: <Save className="h-4 w-4" />,
      example: 'settings.account.autoSave.example'
    },
    {
      id: 'dataCollection',
      label: 'settings.account.dataCollection.label',
      description: 'settings.account.dataCollection.desc',
      type: 'toggle',
      value: settings.dataCollection,
      icon: <BarChart3 className="h-4 w-4" />,
      example: 'settings.account.dataCollection.example'
    }
  ];

  const performanceSettings: SettingOption[] = [
    {
      id: 'autoOptimization',
      label: 'settings.performance.autoOptimization.label',
      description: 'settings.performance.autoOptimization.desc',
      type: 'toggle',
      value: settings.autoOptimization,
      icon: <Zap className="h-4 w-4" />,
      example: 'settings.performance.autoOptimization.example'
    },
    {
      id: 'cacheEnabled',
      label: 'settings.performance.cacheEnabled.label',
      description: 'settings.performance.cacheEnabled.desc',
      type: 'toggle',
      value: settings.cacheEnabled,
      icon: <Database className="h-4 w-4" />,
      example: 'settings.performance.cacheEnabled.example'
    },
    {
      id: 'compressionEnabled',
      label: 'settings.performance.compressionEnabled.label',
      description: 'settings.performance.compressionEnabled.desc',
      type: 'toggle',
      value: settings.compressionEnabled,
      icon: <FileText className="h-4 w-4" />,
      example: 'settings.performance.compressionEnabled.example'
    }
  ];

  const languageSettings: SettingOption[] = [
    {
      id: 'language',
      label: 'settings.language.language.label',
      description: 'settings.language.language.desc',
      type: 'select',
      value: settings.language,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' },
        { label: 'Deutsch', value: 'de' }
      ],
      icon: <Globe className="h-4 w-4" />,
      example: 'settings.language.language.example'
    },
    {
      id: 'currency',
      label: 'settings.language.currency.label',
      description: 'settings.language.currency.desc',
      type: 'select',
      value: settings.currency,
      options: [
        { label: 'USD ($)', value: 'USD' },
        { label: 'EUR (€)', value: 'EUR' },
        { label: 'GBP (£)', value: 'GBP' },
        { label: 'JPY (¥)', value: 'JPY' }
      ],
      icon: <CreditCard className="h-4 w-4" />,
      example: 'settings.language.currency.example'
    },
    {
      id: 'timezone',
      label: 'settings.language.timezone.label',
      description: 'settings.language.timezone.desc',
      type: 'select',
      value: settings.timezone,
      options: [
        { label: 'New York (EST)', value: 'America/New_York' },
        { label: 'Madrid (CET)', value: 'Europe/Madrid' },
        { label: 'London (GMT)', value: 'Europe/London' },
        { label: 'Tokyo (JST)', value: 'Asia/Tokyo' }
      ],
      icon: <Calendar className="h-4 w-4" />,
      example: 'settings.language.timezone.example'
    }
  ];

  const accessibilitySettings: SettingOption[] = [
    {
      id: 'screenReader',
      label: 'settings.accessibility.screenReader.label',
      description: 'settings.accessibility.screenReader.desc',
      type: 'toggle',
      value: settings.screenReader,
      icon: <Volume2 className="h-4 w-4" />,
      example: 'settings.accessibility.screenReader.example'
    },
    {
      id: 'largeText',
      label: 'settings.accessibility.largeText.label',
      description: 'settings.accessibility.largeText.desc',
      type: 'toggle',
      value: settings.largeText,
      icon: <Eye className="h-4 w-4" />,
      example: 'settings.accessibility.largeText.example'
    },
    {
      id: 'reducedMotion',
      label: 'settings.accessibility.reducedMotion.label',
      description: 'settings.accessibility.reducedMotion.desc',
      type: 'toggle',
      value: settings.reducedMotion,
      icon: <RotateCcw className="h-4 w-4" />,
      example: 'settings.accessibility.reducedMotion.example'
    },
    {
      id: 'colorBlindMode',
      label: 'settings.accessibility.colorBlindMode.label',
      description: 'settings.accessibility.colorBlindMode.desc',
      type: 'toggle',
      value: settings.colorBlindMode,
      icon: <Palette className="h-4 w-4" />,
      example: 'settings.accessibility.colorBlindMode.example'
    }
  ];

  const renderSetting = (setting: SettingOption) => (
    <div key={setting.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {setting.icon}
          <h4 className="text-white font-medium">{t(setting.label, lang)}</h4>
        </div>
        <p className="text-slate-400 text-sm mb-2">{t(setting.description, lang)}</p>
        {setting.example && (
          <div className="mb-2">
            <button
              onClick={() => toggleExample(setting.id)}
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
            >
              {showExamples.has(setting.id) ? <XCircle className="h-3 w-3" /> : <Info className="h-3 w-3" />}
              {showExamples.has(setting.id) ? t('settings.example.hide', lang) : t('settings.example.show', lang)}
            </button>
            {showExamples.has(setting.id) && (
              <p className="text-slate-300 text-xs mt-1 bg-slate-600/50 p-2 rounded">
                💡 {t(setting.example, lang)}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="ml-4">
        {setting.type === 'toggle' && (
          <Button
            variant={setting.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleSetting(setting.id)}
            className={setting.value ? 'bg-green-600 hover:bg-green-500' : 'border-slate-600'}
          >
            {setting.value ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          </Button>
        )}
        {setting.type === 'select' && setting.options && (
          <select
            value={String(setting.value)}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded px-3 py-2"
          >
            {setting.options.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {setting.type === 'button' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSetting(setting.id)}
            className="border-slate-600"
          >
            {setting.value ? t('settings.btn.configured', lang) : t('settings.btn.configure', lang)}
          </Button>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'display':
        return (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-blue-400 font-bold mb-2">{t('settings.tip.display', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.display_body', lang)}</p>
            </div>
            {displaySettings.map(renderSetting)}
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-400 font-bold mb-2">{t('settings.tip.notifications', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.notifications_body', lang)}</p>
            </div>
            {notificationSettings.map(renderSetting)}
          </div>
        );
      case 'account':
        return (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-green-400 font-bold mb-2">{t('settings.tip.account', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.account_body', lang)}</p>
            </div>
            {accountSettings.map(renderSetting)}
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-4">
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-purple-400 font-bold mb-2">{t('settings.tip.performance', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.performance_body', lang)}</p>
            </div>
            {performanceSettings.map(renderSetting)}
          </div>
        );
      case 'language':
        return (
          <div className="space-y-4">
            <div className="bg-indigo-900/20 border border-indigo-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-indigo-400 font-bold mb-2">{t('settings.tip.language', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.language_body', lang)}</p>
            </div>
            {languageSettings.map(renderSetting)}
          </div>
        );
      case 'accessibility':
        return (
          <div className="space-y-4">
            <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4 mb-4">
              <h3 className="text-orange-400 font-bold mb-2">{t('settings.tip.accessibility', lang)}</h3>
              <p className="text-slate-300 text-sm">{t('settings.tip.accessibility_body', lang)}</p>
            </div>
            {accessibilitySettings.map(renderSetting)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-0 left-0 w-screen h-screen max-w-full max-h-full overflow-y-auto bg-[#181c23]/95 z-50"
        style={{ margin: 0, borderRadius: 0 }}
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            <span className="text-xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('settings.title', lang)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings({
                  darkMode: true,
                  responsiveDesign: true,
                  animations: true,
                  highContrast: false,
                  newParts: true,
                  specialOffers: false,
                  systemUpdates: true,
                  emailNotifications: true,
                  twoFactorAuth: false,
                  autoSave: true,
                  dataCollection: false,
                  autoOptimization: true,
                  cacheEnabled: true,
                  compressionEnabled: true,
                  language: 'en',
                  currency: 'USD',
                  timezone: 'America/New_York',
                  screenReader: false,
                  largeText: false,
                  reducedMotion: false,
                  colorBlindMode: false
                })}
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('settings.reset', lang)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
                {t('settings.close', lang)}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
          <Button
            variant={activeTab === 'display' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('display')}
            className={activeTab === 'display' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <Monitor className="h-4 w-4 mr-2" />
            {t('settings.tab.display', lang)}
          </Button>

          <Button
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notifications')}
            className={activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <Bell className="h-4 w-4 mr-2" />
            {t('settings.tab.notifications', lang)}
          </Button>
          
          <Button
            variant={activeTab === 'account' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('account')}
            className={activeTab === 'account' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <User className="h-4 w-4 mr-2" />
            {t('settings.tab.account', lang)}
          </Button>

          <Button
            variant={activeTab === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('performance')}
            className={activeTab === 'performance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('settings.tab.performance', lang)}
          </Button>

          <Button
            variant={activeTab === 'language' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('language')}
            className={activeTab === 'language' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <Globe className="h-4 w-4 mr-2" />
            {t('settings.tab.language', lang)}
          </Button>

          <Button
            variant={activeTab === 'accessibility' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('accessibility')}
            className={activeTab === 'accessibility' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t('settings.tab.accessibility', lang)}
          </Button>
        </div>

        {/* Content */}
        <div className="pt-4 overflow-y-auto max-h-96">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">
              {t('settings.autosave', lang)}
            </p>
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {t('settings.apply', lang)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings; 

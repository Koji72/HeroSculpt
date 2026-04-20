import React, { useState } from 'react';
import {
  SidekickPart,
  SidekickPosition,
  BackgroundPart,
  LightingPreset,
  WeatherType,
  VehiclePart,
  VehiclePosition,
  ExtendedSceneConfig
} from '../types';
import SidekickSelector from './SidekickSelector';
import BackgroundSelector from './BackgroundSelector';
import VehicleSelector from './VehicleSelector';
import { Card } from './ui/card';
import { GamingButton } from './ui/gaming-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLang, t } from '../lib/i18n';

interface ExtendedAssetsPanelProps {
  sceneConfig: ExtendedSceneConfig;
  onSceneConfigChange: (config: ExtendedSceneConfig) => void;
  onClose: () => void;
}

const ExtendedAssetsPanel: React.FC<ExtendedAssetsPanelProps> = ({
  sceneConfig,
  onSceneConfigChange,
  onClose
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState('sidekick');

  const handleSidekickSelect = (sidekick: SidekickPart | null) => {
    onSceneConfigChange({
      ...sceneConfig,
      sidekick: sidekick ? {
        part: sidekick,
        position: sidekick.position,
        animations: sidekick.animations
      } : undefined
    });
  };

  const handleSidekickPositionChange = (position: SidekickPosition) => {
    if (sceneConfig.sidekick) {
      onSceneConfigChange({
        ...sceneConfig,
        sidekick: {
          ...sceneConfig.sidekick,
          position
        }
      });
    }
  };

  const handleBackgroundSelect = (background: BackgroundPart | null) => {
    onSceneConfigChange({
      ...sceneConfig,
      background: background ? {
        part: background,
        lighting: background.lightingPreset,
        weather: background.weather
      } : undefined
    });
  };

  const handleLightingChange = (lighting: LightingPreset) => {
    if (sceneConfig.background) {
      onSceneConfigChange({
        ...sceneConfig,
        background: {
          ...sceneConfig.background,
          lighting
        }
      });
    }
  };

  const handleWeatherChange = (weather: WeatherType) => {
    if (sceneConfig.background) {
      onSceneConfigChange({
        ...sceneConfig,
        background: {
          ...sceneConfig.background,
          weather
        }
      });
    }
  };

  const handleVehicleSelect = (vehicle: VehiclePart | null) => {
    onSceneConfigChange({
      ...sceneConfig,
      vehicle: vehicle ? {
        part: vehicle,
        position: vehicle.position,
        customization: {
          color: vehicle.customization.colors[0],
          effects: [],
          materials: []
        }
      } : undefined
    });
  };

  const handleVehiclePositionChange = (position: VehiclePosition) => {
    if (sceneConfig.vehicle) {
      onSceneConfigChange({
        ...sceneConfig,
        vehicle: {
          ...sceneConfig.vehicle,
          position
        }
      });
    }
  };

  const handleVehicleColorChange = (color: string) => {
    if (sceneConfig.vehicle) {
      onSceneConfigChange({
        ...sceneConfig,
        vehicle: {
          ...sceneConfig.vehicle,
          customization: {
            ...sceneConfig.vehicle.customization,
            color
          }
        }
      });
    }
  };

  const getTotalPrice = () => {
    let total = 0;
    if (sceneConfig.sidekick) total += sceneConfig.sidekick.part.priceUSD;
    if (sceneConfig.background) total += sceneConfig.background.part.priceUSD;
    if (sceneConfig.vehicle) total += sceneConfig.vehicle.part.priceUSD;
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[90vh] bg-gray-900 border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{t('assets.title', lang)}</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              {t('assets.total', lang)} <span className="text-green-400 font-medium">${getTotalPrice().toFixed(2)}</span>
            </div>
            <GamingButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </GamingButton>
          </div>
        </div>

        <div className="flex h-full">
          {/* Panel Principal */}
          <div className="flex-1 p-4 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="sidekick" className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>{t('assets.tab.sidekick', lang)}</span>
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center space-x-2">
                  <span>🌍</span>
                  <span>{t('assets.tab.background', lang)}</span>
                </TabsTrigger>
                <TabsTrigger value="vehicle" className="flex items-center space-x-2">
                  <span>🚗</span>
                  <span>{t('assets.tab.vehicle', lang)}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sidekick" className="h-full">
                <SidekickSelector
                  selectedSidekick={sceneConfig.sidekick?.part}
                  onSidekickSelect={handleSidekickSelect}
                  onPositionChange={handleSidekickPositionChange}
                  currentPosition={sceneConfig.sidekick?.position || SidekickPosition.RIGHT}
                />
              </TabsContent>

              <TabsContent value="background" className="h-full">
                <BackgroundSelector
                  selectedBackground={sceneConfig.background?.part}
                  onBackgroundSelect={handleBackgroundSelect}
                  onLightingChange={handleLightingChange}
                  onWeatherChange={handleWeatherChange}
                  currentLighting={sceneConfig.background?.lighting || LightingPreset.DAY}
                  currentWeather={sceneConfig.background?.weather || WeatherType.CLEAR}
                />
              </TabsContent>

              <TabsContent value="vehicle" className="h-full">
                <VehicleSelector
                  selectedVehicle={sceneConfig.vehicle?.part}
                  onVehicleSelect={handleVehicleSelect}
                  onPositionChange={handleVehiclePositionChange}
                  onColorChange={handleVehicleColorChange}
                  currentPosition={sceneConfig.vehicle?.position || VehiclePosition.GROUND}
                  currentColor={sceneConfig.vehicle?.customization.color || '#FF0000'}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel de Vista Previa */}
          <div className="w-80 p-4 border-l border-gray-700 bg-gray-800/50">
            <h3 className="text-lg font-bold text-white mb-4">{t('assets.preview', lang)}</h3>
            
            <div className="space-y-4">
              {/* Sidekick */}
              {sceneConfig.sidekick && (
                <Card className="p-3 bg-blue-900/20 border-blue-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <h4 className="font-medium text-blue-300">{sceneConfig.sidekick.part.name}</h4>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>{t('assets.position', lang)} {sceneConfig.sidekick.position}</p>
                    <p>{t('assets.type', lang)} {sceneConfig.sidekick.part.companionType}</p>
                    <p>{t('assets.price', lang)} ${sceneConfig.sidekick.part.priceUSD}</p>
                  </div>
                </Card>
              )}

              {/* Background */}
              {sceneConfig.background && (
                <Card className="p-3 bg-green-900/20 border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🌍</span>
                    <h4 className="font-medium text-green-300">{sceneConfig.background.part.name}</h4>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>{t('assets.lighting', lang)} {sceneConfig.background.lighting}</p>
                    <p>{t('assets.weather', lang)} {sceneConfig.background.weather}</p>
                    <p>{t('assets.price', lang)} ${sceneConfig.background.part.priceUSD}</p>
                  </div>
                </Card>
              )}

              {/* Vehicle */}
              {sceneConfig.vehicle && (
                <Card className="p-3 bg-purple-900/20 border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🚗</span>
                    <h4 className="font-medium text-purple-300">{sceneConfig.vehicle.part.name}</h4>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>{t('assets.position', lang)} {sceneConfig.vehicle.position}</p>
                    <p>{t('assets.color', lang)} <span className="inline-block w-3 h-3 rounded border border-gray-600" style={{ backgroundColor: sceneConfig.vehicle.customization.color }}></span></p>
                    <p>{t('assets.price', lang)} ${sceneConfig.vehicle.part.priceUSD}</p>
                  </div>
                </Card>
              )}

              {/* Resumen */}
              <Card className="p-3 bg-gray-700/50 border-gray-600">
                <h4 className="font-medium text-white mb-2">{t('assets.summary', lang)}</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>{t('assets.tab.sidekick', lang)}: {sceneConfig.sidekick ? '✓' : '✗'}</p>
                  <p>{t('assets.tab.background', lang)}: {sceneConfig.background ? '✓' : '✗'}</p>
                  <p>{t('assets.tab.vehicle', lang)}: {sceneConfig.vehicle ? '✓' : '✗'}</p>
                  <div className="border-t border-gray-600 mt-2 pt-2">
                    <p className="font-medium text-green-400">
                      {t('assets.total', lang)} ${getTotalPrice().toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExtendedAssetsPanel; 
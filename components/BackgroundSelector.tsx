import React, { useState } from 'react';
import { BackgroundPart, BackgroundType, LightingPreset, WeatherType, PartCategory, ArchetypeId, ExtendedPartCategory } from '../types';
import { Card } from './ui/card';
import { GamingButton } from './ui/gaming-button';

interface BackgroundSelectorProps {
  selectedBackground?: BackgroundPart;
  onBackgroundSelect: (background: BackgroundPart | null) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onWeatherChange: (weather: WeatherType) => void;
  currentLighting: LightingPreset;
  currentWeather: WeatherType;
}

const SAMPLE_BACKGROUNDS: BackgroundPart[] = [
  {
    id: 'background_urban_01',
         name: 'Futuristic City',
    category: ExtendedPartCategory.BACKGROUND as unknown as PartCategory,
    archetype: ArchetypeId.TECH,
    gltfPath: '/assets/backgrounds/urban/futuristic_city.glb',
    priceUSD: 1.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/background_urban_01/100/100',
    type: BackgroundType.THREE_D,
    lightingPreset: LightingPreset.URBAN,
    weather: WeatherType.CLEAR,
    skyboxPath: '/assets/backgrounds/urban/futuristic_city_skybox.hdr'
  },
  {
    id: 'background_nature_01',
         name: 'Mystic Forest',
    category: ExtendedPartCategory.BACKGROUND as unknown as PartCategory,
    archetype: ArchetypeId.MYSTIC,
    gltfPath: '/assets/backgrounds/nature/mystic_forest.glb',
    priceUSD: 1.49,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/background_nature_01/100/100',
    type: BackgroundType.THREE_D,
    lightingPreset: LightingPreset.NATURAL,
    weather: WeatherType.FOG,
    skyboxPath: '/assets/backgrounds/nature/mystic_forest_skybox.hdr'
  },
  {
    id: 'background_space_01',
         name: 'Space Station',
    category: ExtendedPartCategory.BACKGROUND as unknown as PartCategory,
    archetype: ArchetypeId.TECH,
    gltfPath: '/assets/backgrounds/space/space_station.glb',
    priceUSD: 2.49,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/background_space_01/100/100',
    type: BackgroundType.THREE_D,
    lightingPreset: LightingPreset.DRAMATIC,
    weather: WeatherType.CLEAR,
    skyboxPath: '/assets/backgrounds/space/space_station_skybox.hdr'
  },
  {
    id: 'background_abstract_01',
         name: 'Abstract Dimension',
    category: ExtendedPartCategory.BACKGROUND as unknown as PartCategory,
    archetype: ArchetypeId.MYSTIC,
    gltfPath: '/assets/backgrounds/abstract/dimension.glb',
    priceUSD: 1.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/background_abstract_01/100/100',
    type: BackgroundType.HDR,
    lightingPreset: LightingPreset.MYSTICAL,
    weather: WeatherType.CLEAR,
    hdrPath: '/assets/backgrounds/abstract/dimension.hdr'
  }
];

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  selectedBackground,
  onBackgroundSelect,
  onLightingChange,
  onWeatherChange,
  currentLighting,
  currentWeather
}) => {
  const [hoveredBackground, setHoveredBackground] = useState<string | null>(null);

  const getBackgroundTypeIcon = (type: BackgroundType) => {
    switch (type) {
      case BackgroundType.TWO_D: return '🖼️';
      case BackgroundType.THREE_D: return '🏗️';
      case BackgroundType.HDR: return '🌟';
      default: return '🌍';
    }
  };

  const getLightingIcon = (lighting: LightingPreset) => {
    switch (lighting) {
      case LightingPreset.DAY: return '☀️';
      case LightingPreset.NIGHT: return '🌙';
      case LightingPreset.DRAMATIC: return '⚡';
      case LightingPreset.MYSTICAL: return '✨';
      case LightingPreset.URBAN: return '🏙️';
      case LightingPreset.NATURAL: return '🌿';
      default: return '💡';
    }
  };

  const getWeatherIcon = (weather: WeatherType) => {
    switch (weather) {
      case WeatherType.CLEAR: return '☀️';
      case WeatherType.RAIN: return '🌧️';
      case WeatherType.FOG: return '🌫️';
      case WeatherType.STORM: return '⛈️';
      case WeatherType.SNOW: return '❄️';
      default: return '🌤️';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white">Background</h3>
        <GamingButton
          variant="ghost"
          size="sm"
          onClick={() => onBackgroundSelect(null)}
          className="text-red-400 hover:text-red-300"
        >
                     Remove
        </GamingButton>
      </div>

                {/* Lighting Configuration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Lighting</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(LightingPreset).map((lighting) => (
            <GamingButton
              key={lighting}
              variant={currentLighting === lighting ? "primary" : "ghost"}
              size="sm"
              onClick={() => onLightingChange(lighting)}
              className="text-xs"
            >
              {getLightingIcon(lighting)} {lighting}
            </GamingButton>
          ))}
        </div>
      </div>

                {/* Weather Configuration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Weather</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(WeatherType).map((weather) => (
            <GamingButton
              key={weather}
              variant={currentWeather === weather ? "primary" : "ghost"}
              size="sm"
              onClick={() => onWeatherChange(weather)}
              className="text-xs"
            >
              {getWeatherIcon(weather)} {weather}
            </GamingButton>
          ))}
        </div>
      </div>

      {/* Lista de Fondos */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Available Backgrounds</label>
        <div className="grid grid-cols-1 gap-3">
          {SAMPLE_BACKGROUNDS.map((background) => (
            <Card
              key={background.id}
              className={`p-3 cursor-pointer transition-colors transition-transform transition-shadow duration-200 ${
                selectedBackground?.id === background.id
                  ? 'ring-2 ring-blue-500 bg-blue-500/10'
                  : hoveredBackground === background.id
                  ? 'ring-1 ring-gray-400 bg-gray-800/50'
                  : 'bg-gray-900/50 hover:bg-gray-800/50'
              }`}
              onMouseEnter={() => setHoveredBackground(background.id)}
              onMouseLeave={() => setHoveredBackground(null)}
              onClick={() => onBackgroundSelect(background)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-2xl">
                  {getBackgroundTypeIcon(background.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {background.name}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {background.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">
                        {getLightingIcon(background.lightingPreset)} {background.lightingPreset}
                      </span>
                      <span className="text-xs">
                        {getWeatherIcon(background.weather)} {background.weather}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-green-400">
                      ${background.priceUSD}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Información del Fondo Seleccionado */}
      {selectedBackground && (
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <h4 className="font-medium text-blue-300 mb-2">
            {selectedBackground.name} - {getBackgroundTypeIcon(selectedBackground.type)}
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Type: {selectedBackground.type}</p>
                          <p>Lighting: {getLightingIcon(currentLighting)} {currentLighting}</p>
                          <p>Weather: {getWeatherIcon(currentWeather)} {currentWeather}</p>
            {selectedBackground.skyboxPath && (
              <p>Skybox: {selectedBackground.skyboxPath.split('/').pop()}</p>
            )}
            {selectedBackground.hdrPath && (
              <p>HDR: {selectedBackground.hdrPath.split('/').pop()}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BackgroundSelector; 
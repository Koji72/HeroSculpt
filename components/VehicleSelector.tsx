import React, { useState } from 'react';
import { VehiclePart, VehicleType, VehicleSize, VehiclePosition } from '../types';
import { Card } from './ui/card';
import { GamingButton } from './ui/gaming-button';

interface VehicleSelectorProps {
  selectedVehicle?: VehiclePart;
  onVehicleSelect: (vehicle: VehiclePart | null) => void;
  onPositionChange: (position: VehiclePosition) => void;
  onColorChange: (color: string) => void;
  currentPosition: VehiclePosition;
  currentColor: string;
}

const SAMPLE_VEHICLES: VehiclePart[] = [
  {
    id: 'vehicle_car_01',
    name: 'Supercar Turbo',
    category: 'VEHICLE' as any,
    archetype: 'TECH' as any,
    gltfPath: '/assets/vehicles/car/supercar_turbo.glb',
    priceUSD: 4.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/vehicle_car_01/100/100',
    vehicleType: VehicleType.CAR,
    size: VehicleSize.MEDIUM,
    position: VehiclePosition.GROUND,
    customization: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      effects: ['neon', 'smoke', 'flames', 'electric'],
      materials: ['chrome', 'matte', 'metallic', 'carbon']
    },
    animations: ['idle', 'start', 'drive', 'stop']
  },
  {
    id: 'vehicle_motorcycle_01',
    name: 'Cyber Bike',
    category: 'VEHICLE' as any,
    archetype: 'SPEEDSTER' as any,
    gltfPath: '/assets/vehicles/motorcycle/cyber_bike.glb',
    priceUSD: 3.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/vehicle_motorcycle_01/100/100',
    vehicleType: VehicleType.MOTORCYCLE,
    size: VehicleSize.SMALL,
    position: VehiclePosition.GROUND,
    customization: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      effects: ['neon', 'smoke', 'flames', 'electric'],
      materials: ['chrome', 'matte', 'metallic', 'carbon']
    },
    animations: ['idle', 'start', 'drive', 'wheelie']
  },
  {
    id: 'vehicle_hoverboard_01',
    name: 'Hover Board Pro',
    category: 'VEHICLE' as any,
    archetype: 'TECH' as any,
    gltfPath: '/assets/vehicles/hoverboard/hover_board_pro.glb',
    priceUSD: 2.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/vehicle_hoverboard_01/100/100',
    vehicleType: VehicleType.HOVERBOARD,
    size: VehicleSize.SMALL,
    position: VehiclePosition.FLOATING,
    customization: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      effects: ['neon', 'smoke', 'flames', 'electric'],
      materials: ['chrome', 'matte', 'metallic', 'carbon']
    },
    animations: ['idle', 'hover', 'fly', 'land']
  },
  {
    id: 'vehicle_spaceship_01',
    name: 'Star Cruiser',
    category: 'VEHICLE' as any,
    archetype: 'TECH' as any,
    gltfPath: '/assets/vehicles/spaceship/star_cruiser.glb',
    priceUSD: 6.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/vehicle_spaceship_01/100/100',
    vehicleType: VehicleType.SPACESHIP,
    size: VehicleSize.LARGE,
    position: VehiclePosition.BACKGROUND,
    customization: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      effects: ['neon', 'smoke', 'flames', 'electric'],
      materials: ['chrome', 'matte', 'metallic', 'carbon']
    },
    animations: ['idle', 'launch', 'fly', 'land']
  },
  {
    id: 'vehicle_jetpack_01',
    name: 'Jet Pack Elite',
    category: 'VEHICLE' as any,
    archetype: 'TECH' as any,
    gltfPath: '/assets/vehicles/jetpack/jet_pack_elite.glb',
    priceUSD: 2.49,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/vehicle_jetpack_01/100/100',
    vehicleType: VehicleType.JETPACK,
    size: VehicleSize.SMALL,
    position: VehiclePosition.FLOATING,
    customization: {
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      effects: ['neon', 'smoke', 'flames', 'electric'],
      materials: ['chrome', 'matte', 'metallic', 'carbon']
    },
    animations: ['idle', 'thrust', 'hover', 'land']
  }
];

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedVehicle,
  onVehicleSelect,
  onPositionChange,
  onColorChange,
  currentPosition,
  currentColor
}) => {
  const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

  const getVehicleTypeIcon = (type: VehicleType) => {
    switch (type) {
      case VehicleType.CAR: return '🚗';
      case VehicleType.MOTORCYCLE: return '🏍️';
      case VehicleType.HOVERBOARD: return '🛹';
      case VehicleType.SPACESHIP: return '🚀';
      case VehicleType.JETPACK: return '🛸';
      case VehicleType.FLYING_CARPET: return '🪁';
      default: return '🚁';
    }
  };

  const getSizeLabel = (size: VehicleSize) => {
    switch (size) {
      case VehicleSize.SMALL: return 'Pequeño';
      case VehicleSize.MEDIUM: return 'Mediano';
      case VehicleSize.LARGE: return 'Grande';
      default: return 'Mediano';
    }
  };

  const getPositionLabel = (position: VehiclePosition) => {
    switch (position) {
      case VehiclePosition.GROUND: return 'Suelo';
      case VehiclePosition.FLOATING: return 'Flotando';
      case VehiclePosition.BACKGROUND: return 'Fondo';
      default: return 'Suelo';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Vehículo</h3>
        <GamingButton
          variant="ghost"
          size="sm"
          onClick={() => onVehicleSelect(null)}
          className="text-red-400 hover:text-red-300"
        >
          Remover
        </GamingButton>
      </div>

      {/* Posición del Vehículo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Posición</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(VehiclePosition).map((position) => (
            <GamingButton
              key={position}
              variant={currentPosition === position ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPositionChange(position)}
              className="text-xs"
            >
              {position === VehiclePosition.GROUND && '🛣️ Suelo'}
              {position === VehiclePosition.FLOATING && '☁️ Flotando'}
              {position === VehiclePosition.BACKGROUND && '🌌 Fondo'}
            </GamingButton>
          ))}
        </div>
      </div>

      {/* Selector de Color */}
      {selectedVehicle && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Color</label>
          <div className="grid grid-cols-5 gap-2">
            {selectedVehicle.customization.colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 transition-colors transition-transform transition-shadow ${
                  currentColor === color ? 'border-white scale-110' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lista de Vehículos */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Vehículos Disponibles</label>
        <div className="grid grid-cols-1 gap-3">
          {SAMPLE_VEHICLES.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={`p-3 cursor-pointer transition-colors transition-transform transition-shadow duration-200 ${
                selectedVehicle?.id === vehicle.id
                  ? 'ring-2 ring-blue-500 bg-blue-500/10'
                  : hoveredVehicle === vehicle.id
                  ? 'ring-1 ring-gray-400 bg-gray-800/50'
                  : 'bg-gray-900/50 hover:bg-gray-800/50'
              }`}
              onMouseEnter={() => setHoveredVehicle(vehicle.id)}
              onMouseLeave={() => setHoveredVehicle(null)}
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-2xl">
                  {getVehicleTypeIcon(vehicle.vehicleType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {vehicle.name}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {getSizeLabel(vehicle.size)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">
                        {vehicle.vehicleType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {getPositionLabel(vehicle.position)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-green-400">
                      ${vehicle.priceUSD}
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {vehicle.customization.effects.slice(0, 2).map((effect) => (
                      <div
                        key={effect}
                        className="text-xs px-1 py-0.5 bg-gray-700 rounded"
                        title={effect}
                      >
                        {effect}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Información del Vehículo Seleccionado */}
      {selectedVehicle && (
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <h4 className="font-medium text-blue-300 mb-2">
            {selectedVehicle.name} - {getVehicleTypeIcon(selectedVehicle.vehicleType)}
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Tipo: {selectedVehicle.vehicleType}</p>
            <p>Tamaño: {getSizeLabel(selectedVehicle.size)}</p>
            <p>Posición: {getPositionLabel(currentPosition)}</p>
            <p>Color: <span className="inline-block w-4 h-4 rounded border border-gray-600" style={{ backgroundColor: currentColor }}></span> {currentColor}</p>
            <p>Efectos: {selectedVehicle.customization.effects.join(', ')}</p>
            <p>Animaciones: {selectedVehicle.animations.join(', ')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VehicleSelector; 
import React, { useEffect, useState } from 'react';
import { ArchetypeId, SelectedParts, RPGCharacterSync } from '../types';
import { syncRPGCharacterFromParts, getPartChangeImpact } from '../lib/archetypeData';
import { areRPGCharactersEqual, arePartsEqual } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Target, 
  Star,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface RPGCharacterSheetProps {
  selectedArchetype: ArchetypeId | null;
  selectedParts: SelectedParts;
  onCharacterUpdate?: (character: RPGCharacterSync) => void;
}

const RPGCharacterSheet: React.FC<RPGCharacterSheetProps> = ({
  selectedArchetype,
  selectedParts,
  onCharacterUpdate
}) => {

  const [character, setCharacter] = useState<RPGCharacterSync | null>(null);
  const [lastParts, setLastParts] = useState<SelectedParts>({});
  const [recentChanges, setRecentChanges] = useState<{
    statChanges: Partial<any>;
    newAbilities: string[];
    removedAbilities: string[];
  } | null>(null);

  // Sincronizar personaje cuando cambian las partes
  useEffect(() => {
    if (!selectedArchetype) {
      return;
    }

    let newCharacter: RPGCharacterSync;
    try {
      newCharacter = syncRPGCharacterFromParts(selectedArchetype, selectedParts, character);
    } catch (error) {
      console.error('❌ Error in syncRPGCharacterFromParts:', error);
      return;
    }
    
    // Solo actualizar el estado 'character' si es realmente diferente
    if (!areRPGCharactersEqual(character, newCharacter)) {
      setCharacter(newCharacter);
    }

    // Solo llamar a onCharacterUpdate si el personaje ha cambiado realmente
    if (onCharacterUpdate && !areRPGCharactersEqual(character, newCharacter)) {
      onCharacterUpdate(newCharacter);
    }

    // Detectar cambios específicos
    if (Object.keys(lastParts).length > 0) {
      const changes = detectPartChanges(lastParts, selectedParts, selectedArchetype);
      if (changes) {
        setRecentChanges(changes);
        // Limpiar cambios después de 3 segundos
        setTimeout(() => setRecentChanges(null), 3000);
      }
    }

    // Solo actualizar lastParts si selectedParts ha cambiado realmente
    if (!arePartsEqual(lastParts, selectedParts)) {
      setLastParts(selectedParts);
    }
  }, [selectedArchetype, selectedParts, onCharacterUpdate, character, lastParts]);

  const detectPartChanges = (
    oldParts: SelectedParts,
    newParts: SelectedParts,
    archetypeId: ArchetypeId
  ) => {
    const oldIds = Object.values(oldParts).map(part => part?.id).filter(Boolean);
    const newIds = Object.values(newParts).map(part => part?.id).filter(Boolean);
    
    // Encontrar partes que cambiaron
    const changedParts = newIds.filter(id => !oldIds.includes(id));
    const removedParts = oldIds.filter(id => !newIds.includes(id));
    
    if (changedParts.length === 0 && removedParts.length === 0) return null;
    
    // Calcular impacto del cambio
    let totalStatChanges: Partial<any> = {};
    let totalNewAbilities: string[] = [];
    let totalRemovedAbilities: string[] = [];
    
    // Analizar partes removidas
    removedParts.forEach(partId => {
      const impact = getPartChangeImpact(partId, null, archetypeId);
      Object.entries(impact.statChanges).forEach(([stat, change]) => {
        totalStatChanges[stat] = (totalStatChanges[stat] || 0) - change;
      });
      totalRemovedAbilities.push(...impact.removedAbilities);
    });
    
    // Analizar partes nuevas
    changedParts.forEach(partId => {
      const impact = getPartChangeImpact(null, partId, archetypeId);
      Object.entries(impact.statChanges).forEach(([stat, change]) => {
        totalStatChanges[stat] = (totalStatChanges[stat] || 0) + change;
      });
      totalNewAbilities.push(...impact.newAbilities);
    });
    
    return {
      statChanges: totalStatChanges,
      newAbilities: totalNewAbilities,
      removedAbilities: totalRemovedAbilities
    };
  };

  if (!selectedArchetype || !character) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            RPG Character Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Select an archetype to view the character sheet</p>
        </CardContent>
      </Card>
    );
  }

  const renderStatBar = (stat: string, value: number, maxValue: number = 100) => {
    const percentage = (value / maxValue) * 100;
    const getColor = (val: number) => {
      if (val >= 90) return 'bg-green-500';
      if (val >= 75) return 'bg-blue-500';
      if (val >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300 capitalize">{stat}</span>
          <span className="text-white font-bold">{value}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-colors transition-transform transition-shadow duration-150 ${getColor(value)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderChangeIndicator = (stat: string, change: number) => {
    if (change === 0) return null;
    
    return (
      <div className="flex items-center gap-1 text-xs">
        {change > 0 ? (
          <TrendingUp className="h-3 w-3 text-green-400" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-400" />
        )}
        <span className={change > 0 ? 'text-green-400' : 'text-red-400'}>
          {change > 0 ? '+' : ''}{change}
        </span>
      </div>
    );
  };

  // Si no hay character, mostrar loading
  if (!character) {
    return (
      <div className="space-y-4" style={{ border: '2px solid red', padding: '10px' }}>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              RPG Character Sheet - LOADING
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-slate-400 text-center py-8">
              Loading character... {selectedArchetype}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cambios Recientes */}
      {recentChanges && (
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700 animate-pulse">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Cambios en Stats */}
            {Object.keys(recentChanges.statChanges).length > 0 && (
              <div>
                <h4 className="text-blue-300 text-sm font-semibold mb-2">Statistics:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(recentChanges.statChanges).map(([stat, change]) => (
                    <Badge 
                      key={stat}
                      variant={change > 0 ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {stat}: {change > 0 ? '+' : ''}{change}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Nuevas Habilidades */}
            {recentChanges.newAbilities.length > 0 && (
              <div>
                <h4 className="text-green-300 text-sm font-semibold mb-2">New Abilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {recentChanges.newAbilities.map((ability, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-green-600">
                      <Star className="h-3 w-3 mr-1" />
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Habilidades Removidas */}
            {recentChanges.removedAbilities.length > 0 && (
              <div>
                <h4 className="text-red-300 text-sm font-semibold mb-2">Removed Abilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {recentChanges.removedAbilities.map((ability, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hoja de Personaje Principal */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              RPG Character Sheet
            <div className="flex items-center gap-2 ml-auto">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400 text-sm">
                {character.lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Arquetipo y Compatibilidad */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{character.archetypeId}</h3>
              <p className="text-slate-400 text-sm">Selected Archetype</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {character.compatibility.isOptimal ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                )}
                <span className="text-white font-bold">
                  {character.compatibility.score}/100
                </span>
              </div>
              <p className="text-slate-400 text-sm">Compatibility</p>
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Statistics
            </h4>
            <div className="space-y-3">
              {Object.entries(character.calculatedStats).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-2">
                  <div className="flex-1">
                    {renderStatBar(stat, value)}
                  </div>
                  {recentChanges?.statChanges[stat] && (
                    renderChangeIndicator(stat, recentChanges.statChanges[stat])
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Atributos Físicos */}
          <div>
            <h4 className="text-white font-semibold mb-3">Physical Attributes</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(character.physicalAttributes).map(([attr, value]) => (
                <div key={attr} className="bg-slate-700/50 p-2 rounded">
                  <span className="text-slate-400 text-xs capitalize">{attr}</span>
                  <p className="text-white font-medium capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Efectos Visuales */}
          {character.visualEffects.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3">Visual Effects</h4>
              <div className="flex flex-wrap gap-2">
                {character.visualEffects.map((effect, index) => (
                  <Badge key={index} variant="outline" className="text-purple-300 border-purple-500">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias */}
          {character.compatibility.suggestions.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3">Suggestions</h4>
              <div className="space-y-2">
                {character.compatibility.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-slate-300 text-sm bg-slate-700/50 p-2 rounded">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RPGCharacterSheet; 
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Users, Download, Save, Plus, Upload } from 'lucide-react';
import { BaseCharacterData } from './BaseCharacterSheet';
import { createDefaultCharacter, getSheetComponent, getSystemInfo, validateCharacterData, RPG_SYSTEMS } from './RPGSheetRegistry';
import { SelectedParts, ArchetypeId } from '../../types';

interface RPGCharacterSheetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadToCustomizer?: (character: BaseCharacterData) => void;
  currentSelectedParts?: SelectedParts;
  currentArchetype?: ArchetypeId;
}

const RPGCharacterSheetManager: React.FC<RPGCharacterSheetManagerProps> = ({
  isOpen,
  onClose,
  onLoadToCustomizer,
  currentSelectedParts,
  currentArchetype
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<BaseCharacterData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState<BaseCharacterData[]>([]);
  const [showSystemSelector, setShowSystemSelector] = useState(true);

  // Cargar personajes guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('rpg-characters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        setSavedCharacters(characters);
      } catch (error) {
        console.error('Error loading saved characters:', error);
      }
    }
  }, []);

  // Save personajes
  const saveCharacters = (characters: BaseCharacterData[]) => {
    localStorage.setItem('rpg-characters', JSON.stringify(characters));
    setSavedCharacters(characters);
  };

  // Crear nuevo personaje
  const createNewCharacter = (systemId: string) => {
    const newCharacter = createDefaultCharacter(systemId);
    
    // Include current customizer state if available
    if (currentSelectedParts && currentArchetype) {
      newCharacter.selectedParts = currentSelectedParts;
      newCharacter.archetype = currentArchetype;
    }
    
    setCurrentCharacter(newCharacter);
    setSelectedSystem(systemId);
    setIsEditing(true);
    setShowSystemSelector(false);
  };

  // Cargar personaje existente
  const loadCharacter = (character: BaseCharacterData) => {
    setCurrentCharacter(character);
    setSelectedSystem(character.system);
    setIsEditing(false);
    setShowSystemSelector(false);
  };

  // Save personaje actual
  const saveCurrentCharacter = () => {
    if (!currentCharacter || !validateCharacterData(currentCharacter)) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedCharacters = savedCharacters.filter(c => c.id !== currentCharacter.id);
    updatedCharacters.push(currentCharacter);
    saveCharacters(updatedCharacters);
    setIsEditing(false);
    // Close automáticamente al guardar
    setTimeout(() => {
      setShowSystemSelector(true);
      setSelectedSystem(null);
      setCurrentCharacter(null);
      onClose();
    }, 300);
  };

  // Delete personaje
  const deleteCharacter = (characterId: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      const updatedCharacters = savedCharacters.filter(c => c.id !== characterId);
      saveCharacters(updatedCharacters);
    }
  };

  // Exportar personaje
  const exportCharacter = (character: BaseCharacterData) => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name}-${character.system}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importar personaje
  const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const character = JSON.parse(e.target?.result as string);
        if (validateCharacterData(character)) {
          const updatedCharacters = [...savedCharacters, character];
          saveCharacters(updatedCharacters);
          alert('Character imported successfully!');
        } else {
          alert('Invalid character file');
        }
      } catch (error) {
        alert('Error importing character file');
      }
    };
    reader.readAsText(file);
  };

  // Obtener el componente de hoja de personaje
  const SheetComponent = selectedSystem ? getSheetComponent(selectedSystem) : null;

  const handleCharacterChange = (updatedCharacter: BaseCharacterData) => {
    setCurrentCharacter(updatedCharacter);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleBackToSelector = () => {
    setShowSystemSelector(true);
    setSelectedSystem(null);
    setCurrentCharacter(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen size={24} />
            <span>RPG Character Sheets</span>
          </DialogTitle>
        </DialogHeader>

        {showSystemSelector ? (
          <div className="space-y-6">
            {/* Header con acciones */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Select RPG System</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  Import
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={importCharacter}
                  className="hidden"
                />
              </div>
            </div>

            {/* Sistemas RPG disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RPG_SYSTEMS.map((system) => (
                <Card key={system.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <span className="text-2xl">{system.icon}</span>
                      <div>
                        <div className="text-lg font-bold">{system.name}</div>
                        <div className="text-sm text-gray-600">{system.description}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => createNewCharacter(system.id)}
                        className="flex-1"
                      >
                        <Plus size={16} className="mr-2" />
                        New Character
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Personajes guardados */}
            {savedCharacters.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Users size={20} className="mr-2" />
                  Saved Characters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCharacters.map((character) => {
                    const systemInfo = getSystemInfo(character.system);
                    return (
                      <Card key={character.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span>{character.name}</span>
                            <span className="text-sm text-gray-500">{systemInfo?.name}</span>
                          </CardTitle>
                          <div className="text-sm text-gray-600">Player: {character.player}</div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => loadCharacter(character)}
                              className="flex-1"
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportCharacter(character)}
                            >
                              <Download size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                
                                if (onLoadToCustomizer) {
                                  onLoadToCustomizer(character);
                                } else {
                                  console.error('❌ onLoadToCustomizer function is not provided');
                                }
                              }}
                            >
                              Load to Customizer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCharacter(character.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={handleBackToSelector}>
                ← Back to Systems
              </Button>
              {currentCharacter && (
                <div className="flex space-x-2">
                  <Button onClick={saveCurrentCharacter} disabled={!isEditing}>
                    <Save size={16} className="mr-2" />
                    Save Character
                  </Button>
                </div>
              )}
            </div>

            {/* Hoja de personaje */}
            {SheetComponent && currentCharacter && (
              <SheetComponent
                character={currentCharacter}
                isEditing={isEditing}
                onCharacterChange={handleCharacterChange}
                onToggleEdit={handleToggleEdit}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RPGCharacterSheetManager; 
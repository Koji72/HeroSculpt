import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Users, Download, Save, Plus, Upload } from 'lucide-react';
import { BaseCharacterData } from './BaseCharacterSheet';
import { createDefaultCharacter, getSheetComponent, getSystemInfo, validateCharacterData, RPG_SYSTEMS } from './RPGSheetRegistry';
import { SelectedParts, ArchetypeId } from '../../types';
import { useLang, t } from '../../lib/i18n';

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
  const { lang } = useLang();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<BaseCharacterData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState<BaseCharacterData[]>([]);
  const [showSystemSelector, setShowSystemSelector] = useState(true);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar personajes guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('rpg-characters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        setSavedCharacters(characters);
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error loading saved characters:', error);
      }
    }
  }, []);

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
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
      setActionMessage(t('rpgmgr.err.required_fields', lang));
      return;
    }

    setActionMessage('');
    const updatedCharacters = savedCharacters.filter(c => c.id !== currentCharacter.id);
    updatedCharacters.push(currentCharacter);
    saveCharacters(updatedCharacters);
    setIsEditing(false);
    // Close automáticamente al guardar
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setShowSystemSelector(true);
      setSelectedSystem(null);
      setCurrentCharacter(null);
      onClose();
    }, 300);
  };

  // Delete personaje
  const deleteCharacter = (characterId: string) => {
    setPendingDeleteId(characterId);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      const updatedCharacters = savedCharacters.filter(c => c.id !== pendingDeleteId);
      saveCharacters(updatedCharacters);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
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
          setActionMessage(t('rpgmgr.import.success', lang));
        } else {
          setActionMessage(t('rpgmgr.import.err.invalid', lang));
        }
      } catch (error) {
        setActionMessage(t('rpgmgr.import.err.parse', lang));
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
            <span>{t('rpgmgr.title', lang)}</span>
          </DialogTitle>
        </DialogHeader>

        {showSystemSelector ? (
          <div className="space-y-6">
            {/* Inline action message */}
            {actionMessage && (
              <div className="px-3 py-2 rounded bg-blue-50 border border-blue-200 text-sm text-blue-800">
                {actionMessage}
              </div>
            )}

            {/* Inline delete confirmation */}
            {pendingDeleteId && (
              <div className="px-3 py-2 rounded bg-red-50 border border-red-300 text-sm text-red-800 flex items-center justify-between gap-3">
                <span>{t('rpgmgr.delete.confirm', lang)}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={cancelDelete}>
                    {t('rpgmgr.delete.cancel', lang)}
                  </Button>
                  <Button size="sm" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    {t('rpgmgr.delete.yes', lang)}
                  </Button>
                </div>
              </div>
            )}

            {/* Header con acciones */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{t('rpgmgr.select_system', lang)}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  {t('rpgmgr.import', lang)}
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
                        {t('rpgmgr.new_character', lang)}
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
                  {t('rpgmgr.saved_characters', lang)}
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
                          <div className="text-sm text-gray-600">{t('rpgmgr.player_label', lang)} {character.player}</div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => loadCharacter(character)}
                              className="flex-1"
                            >
                              {t('rpgmgr.load', lang)}
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
                                  if (import.meta.env.DEV) console.error('❌ onLoadToCustomizer function is not provided');
                                }
                              }}
                            >
                              {t('rpgmgr.load_to_customizer', lang)}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCharacter(character.id)}
                            >
                              {t('rpgmgr.delete', lang)}
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
                {t('rpgmgr.back_to_systems', lang)}
              </Button>
              {currentCharacter && (
                <div className="flex flex-col items-end gap-1">
                  {actionMessage && (
                    <span className="text-sm text-red-600">{actionMessage}</span>
                  )}
                  <div className="flex space-x-2">
                    <Button onClick={saveCurrentCharacter} disabled={!isEditing}>
                      <Save size={16} className="mr-2" />
                      {t('rpgmgr.save_character', lang)}
                    </Button>
                  </div>
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
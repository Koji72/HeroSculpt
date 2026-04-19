import React, { useState, useEffect } from 'react';
import { RPGCharacterSync } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLang, t } from '../lib/i18n';

interface VTTToken {
  id: string;
  name: string;
  archetype: string;
  format: string;
  size: number;
  url: string;
  createdAt: Date;
}

interface VTTCharacter {
  id: string;
  name: string;
  archetype: string;
  system: string;
  format: string;
  data: string;
  createdAt: Date;
}

interface VTTLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onExportToken: (format: string, size: number) => void;
  onExportCharacter: (system: string, format: string) => void;
}

const VTTLibrary: React.FC<VTTLibraryProps> = ({
  isOpen,
  onClose,
  onExportToken,
  onExportCharacter
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'tokens' | 'characters'>('tokens');
  const [tokens, setTokens] = useState<VTTToken[]>([]);
  const [characters, setCharacters] = useState<VTTCharacter[]>([]);
  const [selectedToken, setSelectedToken] = useState<VTTToken | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<VTTCharacter | null>(null);

  // Cargar datos del localStorage
  useEffect(() => {
    if (isOpen) {
      loadVTTData();
    }
  }, [isOpen]);

  const loadVTTData = () => {
    try {
      const savedTokens = localStorage.getItem('vtt_tokens');
      const savedCharacters = localStorage.getItem('vtt_characters');
      
      if (savedTokens) {
        setTokens(JSON.parse(savedTokens));
      }
      
      if (savedCharacters) {
        setCharacters(JSON.parse(savedCharacters));
      }
    } catch (error) {
      if (import.meta.env.DEV) { console.error('Error loading VTT data:', error); }
    }
  };

  const saveVTTData = () => {
    try {
      localStorage.setItem('vtt_tokens', JSON.stringify(tokens));
      localStorage.setItem('vtt_characters', JSON.stringify(characters));
    } catch (error) {
      if (import.meta.env.DEV) { console.error('Error saving VTT data:', error); }
    }
  };

  const addToken = (token: VTTToken) => {
    const newTokens = [...tokens, token];
    setTokens(newTokens);
    localStorage.setItem('vtt_tokens', JSON.stringify(newTokens));
  };

  const addCharacter = (character: VTTCharacter) => {
    const newCharacters = [...characters, character];
    setCharacters(newCharacters);
    localStorage.setItem('vtt_characters', JSON.stringify(newCharacters));
  };

  const deleteToken = (tokenId: string) => {
    const newTokens = tokens.filter(token => token.id !== tokenId);
    setTokens(newTokens);
    localStorage.setItem('vtt_tokens', JSON.stringify(newTokens));
  };

  const deleteCharacter = (characterId: string) => {
    const newCharacters = characters.filter(character => character.id !== characterId);
    setCharacters(newCharacters);
    localStorage.setItem('vtt_characters', JSON.stringify(newCharacters));
  };

  const downloadToken = (token: VTTToken) => {
    const link = document.createElement('a');
    link.href = token.url;
    link.download = `${token.name}_${token.size}.${token.format}`;
    link.click();
  };

  const downloadCharacter = (character: VTTCharacter) => {
    const blob = new Blob([character.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name}_${character.system}.${character.format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm will-change-transform flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-slate-900 border-2 border-cyan-400/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              {t('vttlib.title', lang)}
            </h2>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-600">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 py-4 px-6 font-bold text-lg transition-colors ${
              activeTab === 'tokens'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('vttlib.tab.tokens', lang)} ({tokens.length})
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 py-4 px-6 font-bold text-lg transition-colors ${
              activeTab === 'characters'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('vttlib.tab.characters', lang)} ({characters.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              {tokens.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">{t('vttlib.no_tokens_title', lang)}</h3>
                  <p className="text-slate-400">{t('vttlib.no_tokens_desc', lang)}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokens.map(token => (
                    <Card key={token.id} className="bg-slate-800 border border-slate-600 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white">{token.name}</h4>
                        <span className="text-xs text-slate-400">{token.format.toUpperCase()}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.archetype', lang)}</span>
                          <span className="text-white">{token.archetype}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.size', lang)}</span>
                          <span className="text-white">{token.size}x{token.size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.created', lang)}</span>
                          <span className="text-white">{new Date(token.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadToken(token)}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm"
                        >
                          {t('vttlib.download', lang)}
                        </Button>
                        <Button
                          onClick={() => deleteToken(token.id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-sm px-3"
                        >
                          ✕
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="space-y-4">
              {characters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">{t('vttlib.no_chars_title', lang)}</h3>
                  <p className="text-slate-400">{t('vttlib.no_chars_desc', lang)}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map(character => (
                    <Card key={character.id} className="bg-slate-800 border border-slate-600 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-white">{character.name}</h4>
                        <span className="text-xs text-slate-400">{character.system}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.archetype', lang)}</span>
                          <span className="text-white">{character.archetype}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.format', lang)}</span>
                          <span className="text-white">{character.format.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('vttlib.created', lang)}</span>
                          <span className="text-white">{new Date(character.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadCharacter(character)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
                        >
                          {t('vttlib.download', lang)}
                        </Button>
                        <Button
                          onClick={() => deleteCharacter(character.id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-sm px-3"
                        >
                          ✕
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-800 p-4 border-t border-slate-600">
          <div className="flex justify-between items-center">
            <div className="text-slate-400 text-sm">
              {activeTab === 'tokens'
                ? `${tokens.length} ${t('vttlib.tokens_stored', lang)}`
                : `${characters.length} ${t('vttlib.chars_stored', lang)}`
              }
            </div>
            <Button
              onClick={() => {
                if (activeTab === 'tokens') {
                  onExportToken('png', 512);
                } else {
                  onExportCharacter('roll20', 'json');
                }
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
            >
              {activeTab === 'tokens' ? t('vttlib.export_token', lang) : t('vttlib.export_char', lang)}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VTTLibrary; 
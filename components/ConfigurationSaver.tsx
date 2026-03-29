import React, { useState, useEffect } from 'react';
import { SelectedParts } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
// Input component - simple implementation
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${props.className || ''}`}
  />
);
import { Save, Download, Upload, Trash2, Star } from 'lucide-react';

interface SavedConfiguration {
  id: string;
  name: string;
  parts: SelectedParts;
  timestamp: number;
  isFavorite: boolean;
}

interface ConfigurationSaverProps {
  selectedParts: SelectedParts;
  onLoadConfiguration: (parts: SelectedParts, modelName?: string) => void;
}

const ConfigurationSaver: React.FC<ConfigurationSaverProps> = ({
  selectedParts,
  onLoadConfiguration
}) => {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [newConfigName, setNewConfigName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load saved configurations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedConfigurations');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved configurations:', error);
      }
    }
  }, []);

  // Save configurations to localStorage
  const saveToStorage = (configs: SavedConfiguration[]) => {
    localStorage.setItem('savedConfigurations', JSON.stringify(configs));
  };

  const handleSaveConfiguration = () => {
    if (!newConfigName.trim()) return;

    const newConfig: SavedConfiguration = {
      id: Date.now().toString(),
      name: newConfigName.trim(),
      parts: { ...selectedParts },
      timestamp: Date.now(),
      isFavorite: false
    };

    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    saveToStorage(updatedConfigs);
    setNewConfigName('');
    setShowSaveDialog(false);
  };

  const handleLoadConfiguration = (config: SavedConfiguration) => {
    onLoadConfiguration(config.parts, config.name);
  };

  const handleDeleteConfiguration = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    saveToStorage(updatedConfigs);
  };

  const handleToggleFavorite = (id: string) => {
    const updatedConfigs = savedConfigs.map(config =>
      config.id === id ? { ...config, isFavorite: !config.isFavorite } : config
    );
    setSavedConfigs(updatedConfigs);
    saveToStorage(updatedConfigs);
  };

  const handleExportConfiguration = (config: SavedConfiguration) => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.parts) {
          onLoadConfiguration(config.parts);
        }
      } catch (error) {
        console.error('Error importing configuration:', error);
      }
    };
    reader.readAsText(file);
  };

  const sortedConfigs = [...savedConfigs].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="w-full"
              disabled={Object.keys(selectedParts).length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Current Configuration
            </Button>

            {showSaveDialog && (
              <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Configuration name"
                  value={newConfigName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewConfigName(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSaveConfiguration()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveConfiguration} disabled={!newConfigName.trim()}>
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => document.getElementById('import-config')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                id="import-config"
                type="file"
                accept=".json"
                onChange={handleImportConfiguration}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Saved Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedConfigs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved configurations</p>
          ) : (
            <div className="space-y-2">
              {sortedConfigs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFavorite(config.id)}
                      className={`p-1 rounded ${config.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Star className="w-4 h-4" fill={config.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(config.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadConfiguration(config)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportConfiguration(config)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteConfiguration(config.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationSaver; 
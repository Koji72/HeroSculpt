import React, { useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface TextureSelectorProps {
  onTextureChange: (textureType: string, texturePath: string) => void;
  selectedTexture?: string;
}

const TextureSelector: React.FC<TextureSelectorProps> = ({
  onTextureChange,
  selectedTexture = 'none'
}) => {
  const [activeTexture, setActiveTexture] = useState(selectedTexture);

  const textureTypes = {
    leather: {
      name: 'Leather',
      description: 'Realistic leather texture',
      preview: '🟫'
    },
    metal: {
      name: 'Metal',
      description: 'Polished metallic surface',
      preview: '⚙️'
    },
    fabric: {
      name: 'Fabric',
      description: 'Soft fabric texture',
      preview: '🧵'
    },
    plastic: {
      name: 'Plastic',
      description: 'Smooth plastic surface',
      preview: '🔲'
    },
    carbon: {
      name: 'Carbon Fiber',
      description: 'Carbon fiber texture',
      preview: '⚡'
    },
    none: {
      name: 'No Texture',
      description: 'Base material without texture',
      preview: '⬜'
    }
  };

  const handleTextureSelect = (textureType: string) => {
    setActiveTexture(textureType);
    onTextureChange(textureType, `/textures/${textureType}.jpg`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Texture Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(textureTypes).map(([key, texture]) => (
              <button
                key={key}
                onClick={() => handleTextureSelect(key)}
                className={`p-3 rounded-lg border-2 transition-colors transition-transform transition-shadow text-left ${
                  activeTexture === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{texture.preview}</span>
                  <div>
                    <div className="font-medium text-sm">{texture.name}</div>
                    <div className="text-xs text-gray-500">{texture.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Texture Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Texture Intensity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.5"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Texture Scale</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                defaultValue="1"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleTextureSelect('none')}
              >
                Remove Texture
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTextureSelect('leather')}
              >
                Apply Leather
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextureSelector; 
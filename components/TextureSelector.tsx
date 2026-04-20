import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useLang, t } from '../lib/i18n';

interface TextureSelectorProps {
  onTextureChange: (textureType: string, texturePath: string) => void;
  selectedTexture?: string;
}

type TextureKey = 'leather' | 'metal' | 'fabric' | 'plastic' | 'carbon' | 'none';

const TEXTURE_PREVIEWS: Record<TextureKey, string> = {
  leather: '🟫',
  metal: '⚙️',
  fabric: '🧵',
  plastic: '🔲',
  carbon: '⚡',
  none: '⬜',
};

const TEXTURE_KEYS: TextureKey[] = ['leather', 'metal', 'fabric', 'plastic', 'carbon', 'none'];

const TextureSelector: React.FC<TextureSelectorProps> = ({
  onTextureChange,
  selectedTexture = 'none'
}) => {
  const { lang } = useLang();
  const [activeTexture, setActiveTexture] = useState(selectedTexture);

  useEffect(() => { setActiveTexture(selectedTexture); }, [selectedTexture]);

  const handleTextureSelect = (textureType: string) => {
    setActiveTexture(textureType);
    onTextureChange(textureType, `/textures/${textureType}.jpg`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('texture.config_title', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {TEXTURE_KEYS.map((key) => (
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
                  <span className="text-2xl">{TEXTURE_PREVIEWS[key]}</span>
                  <div>
                    <div className="font-medium text-sm">{t(`texture.name.${key}`, lang)}</div>
                    <div className="text-xs text-gray-500">{t(`texture.desc.${key}`, lang)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('texture.settings_title', lang)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">{t('texture.intensity', lang)}</label>
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
              <label className="block text-sm font-medium mb-2">{t('texture.scale', lang)}</label>
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
                {t('texture.remove', lang)}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTextureSelect('leather')}
              >
                {t('texture.apply_leather', lang)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextureSelector; 
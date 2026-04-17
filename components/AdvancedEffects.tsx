import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ColorCorrectionShader } from 'three/examples/jsm/shaders/ColorCorrectionShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AdvancedEffectsProps {
  getScene: () => THREE.Scene | null; // Changed to getter function
  getCamera: () => THREE.Camera | null; // Changed to getter function
  getRenderer: () => THREE.WebGLRenderer | null; // Changed to getter function
  onComposerChange?: (composer: EffectComposer | null) => void;
}

interface EffectPreset {
  name: string;
  description: string;
  effects: {
    ssao: boolean;
    bloom: boolean;
    colorCorrection: boolean;
    ssaoSettings?: {
      kernelRadius: number;
      minDistance: number;
      maxDistance: number;
    };
    bloomSettings?: {
      strength: number;
      radius: number;
      threshold: number;
    };
  };
}

const AdvancedEffects: React.FC<AdvancedEffectsProps> = ({
  getScene, // New prop
  getCamera, // New prop
  getRenderer, // New prop
  onComposerChange
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('none');
  // const [composer, setComposer] = useState<EffectComposer | null>(null); // Removed: not used
  const [effectSettings, setEffectSettings] = useState({
    ssao: { enabled: false, kernelRadius: 0.5, minDistance: 0.001, maxDistance: 0.1 },
    bloom: { enabled: false, strength: 0.2, radius: 0.5, threshold: 0.85 },
    colorCorrection: { enabled: false, powRGB: { x: 1.0, y: 1.0, z: 1.0 } }
  });

  const effectPresets: EffectPreset[] = [
    {
      name: 'None',
      description: 'No post-processing effects',
      effects: { ssao: false, bloom: false, colorCorrection: false }
    },
    {
      name: 'Realistic',
      description: 'SSAO for realistic ambient shadows',
      effects: { 
        ssao: true, 
        bloom: false, 
        colorCorrection: false,
        ssaoSettings: { kernelRadius: 0.5, minDistance: 0.001, maxDistance: 0.1 }
      }
    },
    {
      name: 'Cinematic',
      description: 'Smooth bloom for a cinematic look',
      effects: { 
        ssao: true, 
        bloom: true, 
        colorCorrection: false,
        ssaoSettings: { kernelRadius: 0.3, minDistance: 0.001, maxDistance: 0.05 },
        bloomSettings: { strength: 0.3, radius: 0.7, threshold: 0.9 }
      }
    },
    {
      name: 'Dramatic',
      description: 'Intense bloom with color correction',
      effects: { 
        ssao: true, 
        bloom: true, 
        colorCorrection: true,
        ssaoSettings: { kernelRadius: 0.8, minDistance: 0.001, maxDistance: 0.15 },
        bloomSettings: { strength: 0.5, radius: 0.3, threshold: 0.7 }
      }
    },
    {
      name: 'Neon',
      description: 'Neon effects with intense bloom',
      effects: { 
        ssao: false, 
        bloom: true, 
        colorCorrection: true,
        bloomSettings: { strength: 0.8, radius: 0.2, threshold: 0.5 }
      }
    }
  ];

  const createComposer = () => {
    const scene = getScene();
    const camera = getCamera();
    const renderer = getRenderer();

    if (!scene || !camera || !renderer) return null;

    const newComposer = new EffectComposer(renderer);
    newComposer.addPass(new RenderPass(scene, camera));

    // SSAO Pass
    if (effectSettings.ssao.enabled) {
      const ssaoPass = new SSAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height);
      ssaoPass.kernelRadius = effectSettings.ssao.kernelRadius;
      ssaoPass.minDistance = effectSettings.ssao.minDistance;
      ssaoPass.maxDistance = effectSettings.ssao.maxDistance;
      newComposer.addPass(ssaoPass);
    }

    // Bloom Pass
    if (effectSettings.bloom.enabled) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(renderer.domElement.width, renderer.domElement.height),
        effectSettings.bloom.strength,
        effectSettings.bloom.radius,
        effectSettings.bloom.threshold
      );
      newComposer.addPass(bloomPass);
    }

    // Color Correction Pass
    if (effectSettings.colorCorrection.enabled) {
      const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
      colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(
        effectSettings.colorCorrection.powRGB.x,
        effectSettings.colorCorrection.powRGB.y,
        effectSettings.colorCorrection.powRGB.z
      );
      newComposer.addPass(colorCorrectionPass);
    }

    return newComposer;
  };

  const applyPreset = (preset: EffectPreset) => {
    setActivePreset(preset.name);
    
    const newSettings = {
      ssao: { 
        enabled: preset.effects.ssao, 
        kernelRadius: preset.effects.ssaoSettings?.kernelRadius || 0.5,
        minDistance: preset.effects.ssaoSettings?.minDistance || 0.001,
        maxDistance: preset.effects.ssaoSettings?.maxDistance || 0.1
      },
      bloom: { 
        enabled: preset.effects.bloom, 
        strength: preset.effects.bloomSettings?.strength || 0.2,
        radius: preset.effects.bloomSettings?.radius || 0.5,
        threshold: preset.effects.bloomSettings?.threshold || 0.85
      },
      colorCorrection: { 
        enabled: preset.effects.colorCorrection, 
        powRGB: { x: 1.0, y: 1.0, z: 1.0 }
      }
    };

    setEffectSettings(newSettings);
    setIsEnabled(preset.name !== 'None');
  };

  useEffect(() => {
    let composer: EffectComposer | null = null;
    if (isEnabled) {
      composer = createComposer();
      onComposerChange?.(composer);
    } else {
      onComposerChange?.(null);
    }
    return () => {
      composer?.dispose();
    };
  }, [isEnabled, effectSettings, getScene, getCamera, getRenderer, onComposerChange]);

  const updateEffectSettings = (effect: 'ssao' | 'bloom' | 'colorCorrection', setting: string, value: number) => {
    setEffectSettings(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect],
        [setting]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle principal */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable effects</label>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4"
            />
          </div>

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium mb-2">Presets</label>
            <div className="grid grid-cols-1 gap-2">
              {effectPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={activePreset === preset.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="justify-start text-xs"
                >
                  <div className="text-left">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs opacity-70">{preset.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Detailed Configuration */}
          {isEnabled && (
            <div className="space-y-4 pt-4 border-t">
              {/* SSAO Settings */}
              {effectSettings.ssao.enabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">SSAO (Ambient Shadows)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">Kernel Radius</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={effectSettings.ssao.kernelRadius}
                        onChange={(e) => updateEffectSettings('ssao', 'kernelRadius', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{effectSettings.ssao.kernelRadius.toFixed(1)}</span>
                    </div>
                    <div>
                      <label className="text-xs">Minimum Distance</label>
                      <input
                        type="range"
                        min="0.001"
                        max="0.01"
                        step="0.001"
                        value={effectSettings.ssao.minDistance}
                        onChange={(e) => updateEffectSettings('ssao', 'minDistance', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{effectSettings.ssao.minDistance.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bloom Settings */}
              {effectSettings.bloom.enabled && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bloom (Glow)</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">Intensity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={effectSettings.bloom.strength}
                        onChange={(e) => updateEffectSettings('bloom', 'strength', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{effectSettings.bloom.strength.toFixed(1)}</span>
                    </div>
                    <div>
                      <label className="text-xs">Radius</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={effectSettings.bloom.radius}
                        onChange={(e) => updateEffectSettings('bloom', 'radius', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{effectSettings.bloom.radius.toFixed(1)}</span>
                    </div>
                    <div>
                      <label className="text-xs">Threshold</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={effectSettings.bloom.threshold}
                        onChange={(e) => updateEffectSettings('bloom', 'threshold', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{effectSettings.bloom.threshold.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedEffects; 
import React from 'react';
import { ArchetypeId, SelectedParts } from '../types';
import { useLang, t } from '../lib/i18n';
import { 
  isOptimalPartCombination, 
  getRecommendedParts, 
  isPartCompatibleWithArchetype,
  getRecommendedVisualEffects 
} from '../lib/archetypeData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Zap, 
  Shield, 
  Target,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

interface PartCompatibilityAnalyzerProps {
  selectedArchetype: ArchetypeId | null;
  selectedParts: SelectedParts;
  onOptimize?: () => void;
}

const PartCompatibilityAnalyzer: React.FC<PartCompatibilityAnalyzerProps> = ({
  selectedArchetype,
  selectedParts,
  onOptimize
}) => {
  const { lang } = useLang();

  if (!selectedArchetype) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('compat.title', lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">{t('compat.no_archetype', lang)}</p>
        </CardContent>
      </Card>
    );
  }

  const selectedPartIds = Object.values(selectedParts || {}).map(part => part?.id).filter(Boolean);
  const compatibility = isOptimalPartCombination(selectedPartIds, selectedArchetype);
  const recommendedParts = getRecommendedParts(selectedArchetype);
  const visualEffects = getRecommendedVisualEffects(selectedArchetype);

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompatibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <AlertTriangle className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Compatibility Summary */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('compat.title', lang)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">{t('compat.score', lang)}</span>
            <div className="flex items-center gap-2">
              {getCompatibilityIcon(compatibility.score)}
              <span className={`font-bold ${getCompatibilityColor(compatibility.score)}`}>
                {compatibility.score}/100
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            {compatibility.isOptimal ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            )}
            <span className="text-slate-300">
              {compatibility.isOptimal ? t('compat.optimal', lang) : t('compat.needs_improvement', lang)}
            </span>
          </div>

          {/* Optimize Button */}
          {!compatibility.isOptimal && onOptimize && (
            <Button
              onClick={onOptimize}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('compat.optimize_btn', lang)}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Selected Parts */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('compat.selected_parts', lang)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedPartIds.map(partId => {
              const isCompatible = isPartCompatibleWithArchetype(partId, selectedArchetype);
              const isRecommended = recommendedParts.includes(partId);
              
              return (
                <div key={partId} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                  <span className="text-slate-300">{partId}</span>
                  <div className="flex items-center gap-2">
                    {isRecommended && <Star className="h-4 w-4 text-yellow-400" />}
                    {isCompatible ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {compatibility.suggestions.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              {t('compat.suggestions', lang)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compatibility.suggestions.map((suggestion) => (
                <div key={suggestion} className="flex items-start gap-2 p-2 bg-slate-700/50 rounded">
                  <Zap className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Visual Effects */}
      {visualEffects.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t('compat.visual_effects', lang)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {visualEffects.map((effect) => (
                <span
                  key={effect}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-full"
                >
                  {effect}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartCompatibilityAnalyzer; 
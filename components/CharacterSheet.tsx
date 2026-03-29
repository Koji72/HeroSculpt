import React, { useRef } from 'react';
import { SelectedParts, ArchetypeId } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Download, 
  Share2, 
  Printer, 
  Star, 
  Shield, 
  Zap, 
  Flame, 
  Brain,
  Heart,
  Eye,
  Crown,
  Sword,
  X,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

interface CharacterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  screenshotDataUrl?: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  isOpen,
  onClose,
  selectedParts,
  selectedArchetype,
  screenshotDataUrl
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Calculate character stats based on parts
  const calculateStats = () => {
    const parts = Object.values(selectedParts);
    const totalParts = parts.length;
    const totalPrice = parts.reduce((sum, part) => sum + (part?.priceUSD || 0), 0);
    
    // Calculate power level based on parts
    const powerLevel = Math.min(100, totalParts * 10 + Math.floor(totalPrice / 10));
    
    // Determine archetype bonuses
    const archetypeBonus = selectedArchetype === ArchetypeId.STRONG ? 15 : 10;
    
    return {
      totalParts,
      totalPrice,
      powerLevel: Math.min(100, powerLevel + archetypeBonus),
      archetype: selectedArchetype
    };
  };

  const stats = calculateStats();

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (printRef.current) {
      // Convert to PDF or image
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Superhero',
        text: `Check out my superhero! Power level: ${stats.powerLevel}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getArchetypeInfo = () => {
    switch (selectedArchetype) {
      case ArchetypeId.STRONG:
        return {
          name: 'Strong',
          description: 'Hero of brute force and endurance',
          primaryPower: 'Superhuman Strength',
          secondaryPower: 'Endurance',
          color: 'red',
          gradient: 'from-red-500 to-orange-500'
        };
      case ArchetypeId.JUSTICIERO:
        return {
          name: 'Justiciero',
          description: 'Hero of justice and balance',
          primaryPower: 'Justice',
          secondaryPower: 'Balance',
          color: 'blue',
          gradient: 'from-blue-500 to-cyan-500'
        };
      default:
        return {
          name: 'Unknown',
          description: 'Undefined archetype',
          primaryPower: 'Mystery',
          secondaryPower: 'Adaptability',
          color: 'purple',
          gradient: 'from-purple-500 to-pink-500'
        };
    }
  };

  const archetypeInfo = getArchetypeInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-2 border-cyan-400 shadow-2xl">
        <DialogHeader className="relative">
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 border-2 border-red-400 text-white transition-all duration-200 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <DialogTitle className="text-3xl font-bold text-white flex items-center gap-3 justify-center py-4">
            <div className="relative">
              <Crown className="h-8 w-8 text-yellow-300 animate-pulse" />
              <Sparkles className="h-4 w-4 text-yellow-200 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <span className="bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
              Character Sheet
            </span>
            <div className="relative">
              <Award className="h-8 w-8 text-cyan-300 animate-pulse" />
              <Sparkles className="h-4 w-4 text-cyan-200 absolute -top-1 -right-1 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="space-y-8">
          {/* Header */}
          <Card className="bg-gradient-to-br from-blue-800/90 via-purple-800/80 to-pink-800/90 border-2 border-cyan-400 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start gap-8">
                {/* Character Image */}
                <div className="relative w-56 h-72 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl border-2 border-cyan-300 flex items-center justify-center overflow-hidden shadow-2xl group">
                  {screenshotDataUrl ? (
                    <img 
                      src={screenshotDataUrl} 
                      alt="Superhero" 
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce">🦸‍♂️</div>
                      <div className="text-cyan-200 text-sm font-medium">Hero preview</div>
                    </div>
                  )}
                  
                  {/* Level Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-yellow-300">
                    Level {Math.floor(stats.powerLevel / 10) + 1}
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Character Info */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                      <span className="bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
                        Custom {archetypeInfo.name}
                      </span>
                      <Target className="h-8 w-8 text-cyan-300 animate-pulse" />
                    </h1>
                    <p className="text-cyan-200 text-lg leading-relaxed">{archetypeInfo.description}</p>
                  </div>
                  
                  {/* Power Level */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-cyan-200 mb-2">
                      <span className="font-medium">Power Level</span>
                      <span className="font-bold text-yellow-300">{stats.powerLevel}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border-2 border-cyan-400">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${stats.powerLevel}%` }}
                      >
                        <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-700/80 to-purple-700/80 rounded-xl border-2 border-blue-400 shadow-lg hover:shadow-blue-400/50 transition-all duration-300 group">
                      <div className="text-3xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">{stats.totalParts}</div>
                      <div className="text-sm text-cyan-200 font-medium">Equipped Parts</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-700/80 to-pink-700/80 rounded-xl border-2 border-purple-400 shadow-lg hover:shadow-purple-400/50 transition-all duration-300 group">
                      <div className="text-3xl font-bold text-purple-300 group-hover:text-purple-200 transition-colors">${stats.totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-cyan-200 font-medium">Total Value</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Powers and Abilities */}
          <Card className="bg-gradient-to-br from-green-800/90 to-emerald-800/90 border-2 border-green-400 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Powers and Abilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-600/80 to-red-500/60 rounded-xl border-2 border-red-400 hover:border-red-300 transition-all duration-300 group">
                    <div className="p-3 bg-red-500/40 rounded-lg group-hover:bg-red-500/60 transition-colors">
                      <Flame className="h-7 w-7 text-red-200" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{archetypeInfo.primaryPower}</div>
                      <div className="text-red-200 text-sm font-medium">Primary Power</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600/80 to-blue-500/60 rounded-xl border-2 border-blue-400 hover:border-blue-300 transition-all duration-300 group">
                    <div className="p-3 bg-blue-500/40 rounded-lg group-hover:bg-blue-500/60 transition-colors">
                      <Shield className="h-7 w-7 text-blue-200" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{archetypeInfo.secondaryPower}</div>
                      <div className="text-blue-200 text-sm font-medium">Secondary Power</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600/80 to-purple-500/60 rounded-xl border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 group">
                    <div className="p-3 bg-purple-500/40 rounded-lg group-hover:bg-purple-500/60 transition-colors">
                      <Brain className="h-7 w-7 text-purple-200" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Intelligence</div>
                      <div className="text-purple-200 text-sm font-medium">High Level</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-600/80 to-green-500/60 rounded-xl border-2 border-green-400 hover:border-green-300 transition-all duration-300 group">
                    <div className="p-3 bg-green-500/40 rounded-lg group-hover:bg-green-500/60 transition-colors">
                      <Heart className="h-7 w-7 text-green-200" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Endurance</div>
                      <div className="text-green-200 text-sm font-medium">Maximum Level</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment List */}
          <Card className="bg-gradient-to-br from-orange-800/90 to-red-800/90 border-2 border-orange-400 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                  <Sword className="h-6 w-6 text-white" />
                </div>
                Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedParts || {}).map(([category, part]) => (
                  <div key={category} className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-700/60 to-red-700/60 rounded-xl border-2 border-orange-400/50 hover:border-orange-300 transition-all duration-300 group">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/50 transition-all duration-300">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{part?.name || 'Unequipped'}</div>
                      <div className="text-orange-200 text-sm font-medium capitalize">{category.replace('_', ' ')}</div>
                    </div>
                    {part?.priceUSD && (
                      <div className="text-green-300 text-sm font-bold bg-green-600/30 px-3 py-1 rounded-full border-2 border-green-400">
                        ${part.priceUSD.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Character Bio */}
          <Card className="bg-gradient-to-br from-cyan-800/90 to-blue-800/90 border-2 border-cyan-400 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                Hero Biography
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-cyan-700/60 to-blue-700/60 rounded-xl border-2 border-cyan-400/50">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    Origin
                  </h4>
                  <p className="text-cyan-200 text-base leading-relaxed">
                    A {archetypeInfo.name.toLowerCase()} that emerged from the depths of custom design. 
                    Equipped with {stats.totalParts} high-quality equipment pieces, 
                    this hero represents the perfect combination of style and functionality.
                  </p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-cyan-700/60 to-blue-700/60 rounded-xl border-2 border-cyan-400/50">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-300" />
                    Mission
                  </h4>
                  <p className="text-cyan-200 text-base leading-relaxed">
                    Protect creativity and individuality in a world that seeks uniformity. 
                    With a power level of {stats.powerLevel}/100, this hero is ready to 
                    face any challenge that presents itself.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 pt-8 border-t-2 border-cyan-400/50">
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print
          </Button>
          
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300"
          >
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-2 border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:border-purple-300 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-purple-400/50 transition-all duration-300"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="border-2 border-red-400 text-red-200 hover:bg-red-500/20 hover:border-red-300 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-400/50 transition-all duration-300"
          >
            <X className="h-5 w-5 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterSheet; 
import React, { useRef, useState, useCallback } from 'react';
import { SelectedParts, ArchetypeId } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Download, 
  Share2, 
  Printer, 
  Camera,
  Save,
  Edit,
  X,
  Plus,
  Star,
  Shield,
  Zap,
  Flame,
  Brain,
  Heart,
  Eye,
  Crown,
  Sword,
  User,
  FileText,
  Image
} from 'lucide-react';
import CharacterViewer, { CharacterViewerRef } from './CharacterViewer';

interface CharacterSheetTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  onSave?: (characterData: CharacterData) => void;
}

interface CharacterData {
  id: string;
  name: string;
  archetype: ArchetypeId | null;
  description: string;
  powers: string[];
  weaknesses: string[];
  backstory: string;
  screenshot: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    durability: number;
    power: number;
    combat: number;
  };
  selectedParts: SelectedParts;
  createdAt: string;
  updatedAt: string;
}

const CharacterSheetTemplate: React.FC<CharacterSheetTemplateProps> = ({
  isOpen,
  onClose,
  selectedParts,
  selectedArchetype,
  onSave
}) => {
  const characterViewerRef = useRef<CharacterViewerRef>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  const [characterData, setCharacterData] = useState<CharacterData>({
    id: `character_${Date.now()}`,
    name: '',
    archetype: selectedArchetype,
    description: '',
    powers: [''],
    weaknesses: [''],
    backstory: '',
    screenshot: '',
    stats: {
      strength: 50,
      agility: 50,
      intelligence: 50,
      durability: 50,
      power: 50,
      combat: 50
    },
    selectedParts,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);

  // Calculate character stats based on parts
  const calculateStats = useCallback(() => {
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
  }, [selectedParts, selectedArchetype]);

  const stats = calculateStats();

  const handleTakeScreenshot = async () => {
    if (!characterViewerRef.current) return;
    
    setIsTakingScreenshot(true);
    try {
      const screenshotDataUrl = await characterViewerRef.current.takeScreenshot();
      setCharacterData(prev => ({
        ...prev,
        screenshot: screenshotDataUrl
      }));
    } catch (error) {
      console.error('Error taking screenshot:', error);
    } finally {
      setIsTakingScreenshot(false);
    }
  };

  const handleSave = () => {
    const updatedData = {
      ...characterData,
      updatedAt: new Date().toISOString(),
      selectedParts
    };
    
    setCharacterData(updatedData);
    onSave?.(updatedData);
    setIsEditing(false);
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (printRef.current) {
      // Convert to PDF or image
      const link = document.createElement('a');
      link.download = `${characterData.name || 'character'}-sheet.png`;
      link.href = characterData.screenshot || '';
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: characterData.name || 'My Custom Superhero',
        text: `Check out my superhero! Power level: ${stats.powerLevel}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const addPower = () => {
    setCharacterData(prev => ({
      ...prev,
      powers: [...prev.powers, '']
    }));
  };

  const removePower = (index: number) => {
    setCharacterData(prev => ({
      ...prev,
      powers: prev.powers.filter((_, i) => i !== index)
    }));
  };

  const updatePower = (index: number, value: string) => {
    setCharacterData(prev => ({
      ...prev,
      powers: prev.powers.map((power, i) => i === index ? value : power)
    }));
  };

  const addWeakness = () => {
    setCharacterData(prev => ({
      ...prev,
      weaknesses: [...prev.weaknesses, '']
    }));
  };

  const removeWeakness = (index: number) => {
    setCharacterData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.filter((_, i) => i !== index)
    }));
  };

  const updateWeakness = (index: number, value: string) => {
    setCharacterData(prev => ({
      ...prev,
      weaknesses: prev.weaknesses.map((weakness, i) => i === index ? value : weakness)
    }));
  };

  const getArchetypeInfo = () => {
    switch (selectedArchetype) {
      case ArchetypeId.STRONG:
        return {
          name: 'Strong',
          description: 'Hero of brute force and endurance',
          primaryPower: 'Superhuman Strength',
          secondaryPower: 'Endurance',
          color: 'red'
        };
      case ArchetypeId.JUSTICIERO:
        return {
          name: 'Justiciero',
          description: 'Hero of justice and balance',
          primaryPower: 'Justice',
          secondaryPower: 'Balance',
          color: 'blue'
        };
      default:
        return {
          name: 'Custom',
          description: 'Custom hero with unique abilities',
          primaryPower: 'Versatility',
          secondaryPower: 'Adaptability',
          color: 'gray'
        };
    }
  };

  const archetypeInfo = getArchetypeInfo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border-2 border-cyan-400">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-cyan-400/50 bg-gradient-to-r from-blue-800/50 to-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
              Character Sheet Template
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 border-2 border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:border-purple-300 font-bold px-4 py-2 rounded-xl transition-all duration-300"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 border-2 border-red-400 text-red-200 hover:bg-red-500/20 hover:border-red-300 font-bold px-4 py-2 rounded-xl transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6" ref={printRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Character Info */}
            <div className="space-y-6">
              {/* Character Name and Basic Info */}
              <Card className="bg-gradient-to-br from-blue-800/90 to-purple-800/90 border-2 border-blue-400 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Character Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="characterName" className="text-cyan-200 font-medium">Character Name</Label>
                    <Input
                      id="characterName"
                      value={characterData.name}
                      onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter character name..."
                      className="mt-1 bg-slate-700/50 border-cyan-400 text-white placeholder:text-slate-400 focus:border-cyan-300"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-cyan-200 font-medium">Archetype</Label>
                    <Badge variant="outline" className="mt-1 bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-purple-400 text-purple-200">
                      {archetypeInfo.name}
                    </Badge>
                    <p className="text-sm text-cyan-200 mt-1">{archetypeInfo.description}</p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-cyan-200 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={characterData.description}
                      onChange={(e) => setCharacterData(prev => ({ ...prev, description: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Describe your character..."
                      className="mt-1 bg-slate-700/50 border-cyan-400 text-white placeholder:text-slate-400 focus:border-cyan-300"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Powers */}
              <Card className="bg-gradient-to-br from-green-800/90 to-emerald-800/90 border-2 border-green-400 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    Powers & Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {characterData.powers.map((power, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={power}
                        onChange={(e) => updatePower(index, e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter power or ability..."
                        className="bg-green-700/50 border-green-400 text-white placeholder:text-green-200 focus:border-green-300"
                      />
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePower(index)}
                          className="px-2 border-red-400 text-red-200 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={addPower}
                      className="w-full border-green-400 text-green-200 hover:bg-green-500/20 font-bold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Power
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="bg-gradient-to-br from-orange-800/90 to-red-800/90 border-2 border-orange-400 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {characterData.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={weakness}
                        onChange={(e) => updateWeakness(index, e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter weakness..."
                        className="bg-orange-700/50 border-orange-400 text-white placeholder:text-orange-200 focus:border-orange-300"
                      />
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeWeakness(index)}
                          className="px-2 border-red-400 text-red-200 hover:bg-red-500/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={addWeakness}
                      className="w-full border-orange-400 text-orange-200 hover:bg-orange-500/20 font-bold"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Weakness
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-gradient-to-br from-cyan-800/90 to-blue-800/90 border-2 border-cyan-400 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    Character Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-700/50 to-blue-700/50 rounded-xl border border-cyan-400/50">
                      <span className="text-sm font-medium text-cyan-200">Power Level</span>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">{stats.powerLevel}/100</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-700/50 to-purple-700/50 rounded-xl border border-blue-400/50">
                      <span className="text-sm font-medium text-blue-200">Total Parts</span>
                      <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold">{stats.totalParts}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-xl border border-purple-400/50">
                      <span className="text-sm font-medium text-purple-200">Total Value</span>
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold">${stats.totalPrice.toFixed(2)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 3D Viewer and Screenshot */}
            <div className="space-y-6">
              {/* 3D Viewer */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-slate-600 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    3D Character Viewer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="w-full h-96 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden border-2 border-slate-600">
                      <CharacterViewer
                        ref={characterViewerRef}
                        selectedParts={selectedParts}
                        selectedArchetype={selectedArchetype}
                        characterName={characterData.name}
                        onCharacterNameChange={(name) => setCharacterData(prev => ({ ...prev, name }))}
                      />
                    </div>
                    
                    {/* Screenshot Button */}
                    <div className="absolute top-4 right-4">
                      <Button
                        onClick={handleTakeScreenshot}
                        disabled={isTakingScreenshot}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {isTakingScreenshot ? 'Taking...' : 'Take Screenshot'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Screenshot Display */}
              {characterData.screenshot && (
                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-slate-600 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <div className="p-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      Character Screenshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <img
                        src={characterData.screenshot}
                        alt="Character Screenshot"
                        className="w-full h-auto rounded-xl border-2 border-cyan-400"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCharacterData(prev => ({ ...prev, screenshot: '' }))}
                          className="bg-red-500/80 hover:bg-red-600/80 border-red-400 text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Backstory */}
              <Card className="bg-gradient-to-br from-cyan-800/90 to-blue-800/90 border-2 border-cyan-400 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <div className="p-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Backstory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={characterData.backstory}
                    onChange={(e) => setCharacterData(prev => ({ ...prev, backstory: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Write your character's backstory..."
                    className="w-full bg-cyan-700/50 border-cyan-400 text-white placeholder:text-cyan-200 focus:border-cyan-300"
                    rows={6}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-cyan-400/50">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2 border-2 border-blue-400 text-blue-200 hover:bg-blue-500/20 hover:border-blue-300 font-bold px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2 border-2 border-green-400 text-green-200 hover:bg-green-500/20 hover:border-green-300 font-bold px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2 border-2 border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:border-purple-300 font-bold px-4 py-2 rounded-xl transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing && (
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Character
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetTemplate; 
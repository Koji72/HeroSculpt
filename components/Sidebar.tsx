import React from 'react';
import { ArchetypeId } from '@/types';
import { ARCHETYPES } from '@/constants';
import { Settings, HelpCircle, Sparkles, Zap } from 'lucide-react';
import { GamingButton } from './ui/gaming-button';
import { GlassPanel } from './ui/glass-panel';

interface SidebarProps {
  selectedArchetype: ArchetypeId | null;
  onArchetypeSelect: (archetypeId: ArchetypeId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedArchetype, onArchetypeSelect }) => {
  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-amber-500/5 pointer-events-none" />
      
      {/* Logo/Header */}
      <GlassPanel variant="sidebar" glowColor="blue" className="border-0 bg-transparent">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Superhero Customizer
              </h1>
              <p className="text-xs text-slate-400">3D Character Builder</p>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <GlassPanel variant="floating" glowColor="purple" className="mb-4">
          <div className="p-4">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold text-white/90 mb-1">Archetypes</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {ARCHETYPES.map((archetype) => (
                <GamingButton
                  key={archetype.id}
                  variant={selectedArchetype === archetype.id ? "primary" : "ghost"}
                  size="sm"
                  active={selectedArchetype === archetype.id}
                  onClick={() => onArchetypeSelect(archetype.id)}
                  className="w-full justify-start text-left"
                  glowOnHover={selectedArchetype !== archetype.id}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {archetype.name}
                </GamingButton>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Footer Actions */}
      <GlassPanel variant="toolbar" glowColor="blue" className="border-0 bg-transparent">
        <div className="p-4 border-t border-white/10">
          <div className="flex justify-around">
            <GamingButton
              variant="ghost"
              size="sm"
              icon={Settings}
              className="w-12 h-12 rounded-full"
              glowOnHover
            />
            <GamingButton
              variant="ghost"
              size="sm"
              icon={HelpCircle}
              className="w-12 h-12 rounded-full"
              glowOnHover
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default Sidebar;

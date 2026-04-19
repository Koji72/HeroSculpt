import React from 'react';
import { CharacterSheetProps, BaseCharacterData } from './BaseCharacterSheet';
import { Edit2, Save, Plus, X } from 'lucide-react';
import { useLang, t } from '../../lib/i18n';

export interface MAndMCharacterData extends BaseCharacterData {
  complications: string;
  conditions: {
    fatigued: boolean;
    dazed: boolean;
    staggered: boolean;
    incapacitated: boolean;
    disabled: boolean;
    dying: boolean;
    unconscious: boolean;
  };
  defenses: {
    dodge: { value: number; temp: number; total: number };
    parry: { value: number; temp: number; total: number };
    fortitude: { value: number; temp: number; total: number };
    toughness: { value: number; temp: number; total: number };
    will: { value: number; temp: number; total: number };
  };
  abilities: {
    strength: { value: number; cost: number };
    stamina: { value: number; cost: number };
    agility: { value: number; cost: number };
    dexterity: { value: number; cost: number };
    fighting: { value: number; cost: number };
    intellect: { value: number; cost: number };
    awareness: { value: number; cost: number };
    presence: { value: number; cost: number };
  };
  attacks: Array<{
    name: string;
    skill: string;
    attack: number;
    rank: number;
    mod: number;
    descriptor: string;
    dc: number;
    crit: number;
  }>;
  powers: Array<{
    name: string;
    type: string;
    cost: number;
  }>;
  skills: {
    [key: string]: { value: number; ability: string };
  };
}

const MutantsAndMastermindsSheet: React.FC<CharacterSheetProps> = ({
  character,
  isEditing,
  onCharacterChange,
  onToggleEdit
}) => {
  const { lang } = useLang();
  const mnmCharacter = character as MAndMCharacterData;

  const updateCharacter = React.useCallback((path: string, value: any) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(mnmCharacter));
    let current: any = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onCharacterChange(updated);
  }, [mnmCharacter, onCharacterChange]);

  const EditableField = React.memo(({ 
    value, 
    onChange, 
    className = "", 
    type = "text", 
    min, 
    max,
    placeholder = "",
    multiline = false
  }: {
    value: any;
    onChange: (value: any) => void;
    className?: string;
    type?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    multiline?: boolean;
  }) => {
    const [localValue, setLocalValue] = React.useState(value);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(value);
      }
    }, [value, isFocused]);

    const handleChange = React.useCallback((newValue: any) => {
      setLocalValue(newValue);
      onChange(newValue);
    }, [onChange]);

    const handleBlur = React.useCallback(() => {
      setIsFocused(false);
    }, []);

    if (!isEditing) {
      return <span className={className}>{value || placeholder}</span>;
    }
    
    if (multiline) {
      return (
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={`${className} bg-white/20 border border-white/30 rounded px-2 py-1 text-white resize-none focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-transparent text-sm`}
          placeholder={placeholder}
          rows={2}
        />
      );
    }
    
    return (
      <input
        type={type}
        value={localValue}
        onChange={(e) => handleChange(type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`${className} bg-white/20 border border-white/30 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-transparent text-sm`}
        min={min}
        max={max}
        placeholder={placeholder}
      />
    );
  });

  const addAttack = React.useCallback(() => {
    const newAttack = {
      name: t('mnm.new_attack_name', lang),
      skill: t('mnm.new_attack_skill', lang),
      attack: 0,
      rank: 0,
      mod: 0,
      descriptor: t('mnm.new_attack_descriptor', lang),
      dc: 15,
      crit: 20
    };
    updateCharacter('attacks', [...mnmCharacter.attacks, newAttack]);
  }, [mnmCharacter.attacks, updateCharacter, lang]);

  const removeAttack = React.useCallback((index: number) => {
    const newAttacks = mnmCharacter.attacks.filter((_, i) => i !== index);
    updateCharacter('attacks', newAttacks);
  }, [mnmCharacter.attacks, updateCharacter]);

  const removePower = React.useCallback((index: number) => {
    const newPowers = mnmCharacter.powers.filter((_, i) => i !== index);
    updateCharacter('powers', newPowers);
  }, [mnmCharacter.powers, updateCharacter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-orange-800 p-4">
      <div className="max-w-6xl mx-auto bg-gray-900/90 backdrop-blur-sm will-change-transform rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white tracking-wider">{t('mnm.title', lang)}</h1>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
              {t('mnm.complications', lang)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleEdit}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
              <span>{isEditing ? t('mnm.save', lang) : t('mnm.edit', lang)}</span>
            </button>
          </div>
        </div>

        {/* Character Info */}
        <div className="bg-yellow-400 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-black font-semibold">{t('mnm.player', lang)}</span>
            <EditableField
              value={mnmCharacter.player}
              onChange={(value) => updateCharacter('player', value)}
              className="text-black font-bold"
              placeholder={t('mnm.placeholder.player', lang)}
            />
          </div>
          
          <div className="text-4xl font-black text-black tracking-widest">
            <EditableField
              value={mnmCharacter.name}
              onChange={(value) => updateCharacter('name', value)}
              className="text-4xl font-black text-black tracking-widest"
              placeholder={t('mnm.placeholder.character', lang)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-black font-semibold">{t('mnm.level', lang)}</span>
            <EditableField
              value={mnmCharacter.level || 1}
              onChange={(value) => updateCharacter('level', value)}
              className="text-black font-bold text-xl"
              type="number"
              min={1}
              max={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Left Column - Defenses & Abilities */}
          <div className="space-y-6">
            
            {/* Defenses */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.defenses', lang)}</h3>
              <div className="space-y-3">
                {Object.entries(mnmCharacter.defenses).map(([key, defense]) => (
                  <div key={key} className="flex items-center justify-between bg-black/20 rounded p-2">
                    <span className="text-white font-semibold capitalize">{key}</span>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value={defense.value}
                        onChange={(value) => updateCharacter(`defenses.${key}.value`, value)}
                        className="text-white font-bold text-lg w-12 text-center"
                        type="number"
                        min={0}
                        max={20}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.abilities', lang)}</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(mnmCharacter.abilities).map(([key, ability]) => (
                  <div key={key} className="bg-black/20 rounded p-2 text-center">
                    <div className="text-white font-semibold text-sm capitalize mb-1">{key}</div>
                    <EditableField
                      value={ability.value}
                      onChange={(value) => updateCharacter(`abilities.${key}.value`, value)}
                      className="text-white font-bold text-lg"
                      type="number"
                      min={0}
                      max={10}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Attacks & Powers */}
          <div className="space-y-6">
            
            {/* Attacks */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.attacks', lang)}</h3>
              <div className="space-y-2">
                {mnmCharacter.attacks.map((attack, index) => (
                  <div key={index} className="bg-black/20 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <EditableField
                        value={attack.name}
                        onChange={(value) => updateCharacter(`attacks.${index}.name`, value)}
                        className="text-yellow-300 font-bold"
                        placeholder={t('mnm.placeholder.attack', lang)}
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeAttack(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className="text-gray-300 text-xs">{t('mnm.attack_label', lang)}</div>
                        <EditableField
                          value={attack.attack}
                          onChange={(value) => updateCharacter(`attacks.${index}.attack`, value)}
                          className="text-white font-bold text-xs"
                          type="number"
                          min={0}
                          max={20}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-300 text-xs">{t('mnm.attack_dc', lang)}</div>
                        <EditableField
                          value={attack.dc}
                          onChange={(value) => updateCharacter(`attacks.${index}.dc`, value)}
                          className="text-white font-bold text-xs"
                          type="number"
                          min={10}
                          max={30}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-gray-300 text-xs">{t('mnm.attack_crit', lang)}</div>
                        <EditableField
                          value={attack.crit}
                          onChange={(value) => updateCharacter(`attacks.${index}.crit`, value)}
                          className="text-white font-bold text-xs"
                          type="number"
                          min={16}
                          max={20}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <button
                    onClick={addAttack}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>{t('mnm.add_attack', lang)}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Powers */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.powers', lang)}</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mnmCharacter.powers.map((power, index) => (
                  <div key={index} className="bg-black/20 rounded p-2 flex justify-between items-center">
                    <div>
                      <EditableField
                        value={power.name}
                        onChange={(value) => updateCharacter(`powers.${index}.name`, value)}
                        className="text-white font-semibold"
                        placeholder={t('mnm.placeholder.power', lang)}
                      />
                      <EditableField
                        value={power.type}
                        onChange={(value) => updateCharacter(`powers.${index}.type`, value)}
                        className="text-gray-300 text-sm"
                        placeholder={t('mnm.placeholder.power_type', lang)}
                      />
                    </div>
                    <div className="text-right">
                      <EditableField
                        value={power.cost}
                        onChange={(value) => updateCharacter(`powers.${index}.cost`, value)}
                        className="text-yellow-300 font-bold"
                        type="number"
                        min={1}
                      />
                      {isEditing && (
                        <button
                          onClick={() => removePower(index)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="space-y-6">
            
            {/* Skills */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.skills', lang)}</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(mnmCharacter.skills).map(([key, skill]) => (
                  <div key={key} className="bg-black/20 rounded p-2 flex justify-between items-center">
                    <span className="text-white font-semibold capitalize">{key}</span>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value={skill.value}
                        onChange={(value) => updateCharacter(`skills.${key}.value`, value)}
                        className="text-yellow-300 font-bold w-12 text-center"
                        type="number"
                        min={0}
                        max={20}
                      />
                                             <span className="text-gray-400 text-sm">
                         +{(mnmCharacter.abilities as any)[skill.ability]?.value || 0}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Conditions */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">{t('mnm.conditions', lang)}</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(mnmCharacter.conditions).map(([key, active]) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => updateCharacter(`conditions.${key}`, e.target.checked)}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                      disabled={!isEditing}
                    />
                    <span className={`text-sm capitalize ${active ? 'text-red-300' : 'text-gray-300'}`}>
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MutantsAndMastermindsSheet; 
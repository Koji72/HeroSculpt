import React from 'react';
import { CharacterSheetProps, BaseCharacterData } from './BaseCharacterSheet';
import { Edit2, Save, Plus, X, Shield, Zap, Brain, Heart } from 'lucide-react';

export interface ChampionsCharacterData extends BaseCharacterData {
  characteristics: {
    strength: { value: number; cost: number };
    dexterity: { value: number; cost: number };
    constitution: { value: number; cost: number };
    body: { value: number; cost: number };
    intelligence: { value: number; cost: number };
    ego: { value: number; cost: number };
    presence: { value: number; cost: number };
    comeliness: { value: number; cost: number };
    pd: { value: number; cost: number };
    ed: { value: number; cost: number };
    spd: { value: number; cost: number };
    rec: { value: number; cost: number };
    end: { value: number; cost: number };
    stun: { value: number; cost: number };
  };
  skills: Array<{
    _id: string;
    name: string;
    type: string;
    cost: number;
    roll: string;
  }>;
  powers: Array<{
    _id: string;
    name: string;
    type: string;
    cost: number;
    end: number;
    description: string;
  }>;
  complications: Array<{
    _id: string;
    name: string;
    type: string;
    value: number;
    description: string;
  }>;
  experience: {
    earned: number;
    spent: number;
    available: number;
  };
}

const ChampionsSheet: React.FC<CharacterSheetProps> = ({
  character,
  isEditing,
  onCharacterChange,
  onToggleEdit
}) => {
  const championsCharacter = character as unknown as ChampionsCharacterData;

  const updateCharacter = React.useCallback((path: string, value: string | number | boolean) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(championsCharacter));
    let current: Record<string, unknown> = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
    onCharacterChange(updated);
  }, [championsCharacter, onCharacterChange]);

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
    value: string | number;
    onChange: (value: string | number) => void;
    className?: string;
    type?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    multiline?: boolean;
  }) => {
    const [localValue, setLocalValue] = React.useState<string | number>(value);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(value);
      }
    }, [value, isFocused]);

    const handleChange = React.useCallback((newValue: string | number) => {
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
          className={`${className} bg-white/20 border border-white/30 rounded px-2 py-1 text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-sm`}
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
        className={`${className} bg-white/20 border border-white/30 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-sm`}
        min={min}
        max={max}
        placeholder={placeholder}
      />
    );
  });

  const addSkill = React.useCallback(() => {
    const newSkill = {
      _id: crypto.randomUUID(),
      name: "New Skill",
      type: "Everyman",
      cost: 1,
      roll: "11-"
    };
    updateCharacter('skills', [...championsCharacter.skills, newSkill]);
  }, [championsCharacter.skills, updateCharacter]);

  const removeSkill = React.useCallback((index: number) => {
    const newSkills = championsCharacter.skills.filter((_, i) => i !== index);
    updateCharacter('skills', newSkills);
  }, [championsCharacter.skills, updateCharacter]);

  const addPower = React.useCallback(() => {
    const newPower = {
      _id: crypto.randomUUID(),
      name: "New Power",
      type: "Attack",
      cost: 10,
      end: 1,
      description: "Power description"
    };
    updateCharacter('powers', [...championsCharacter.powers, newPower]);
  }, [championsCharacter.powers, updateCharacter]);

  const removePower = React.useCallback((index: number) => {
    const newPowers = championsCharacter.powers.filter((_, i) => i !== index);
    updateCharacter('powers', newPowers);
  }, [championsCharacter.powers, updateCharacter]);

  const addComplication = React.useCallback(() => {
    const newComplication = {
      _id: crypto.randomUUID(),
      name: "New Complication",
      type: "Psychological",
      value: 10,
      description: "Complication description"
    };
    updateCharacter('complications', [...championsCharacter.complications, newComplication]);
  }, [championsCharacter.complications, updateCharacter]);

  const removeComplication = React.useCallback((index: number) => {
    const newComplications = championsCharacter.complications.filter((_, i) => i !== index);
    updateCharacter('complications', newComplications);
  }, [championsCharacter.complications, updateCharacter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto bg-slate-800/90 backdrop-blur-sm will-change-transform rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white tracking-wider">CHAMPIONS</h1>
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
              HERO SYSTEM
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleEdit}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Character Info */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-black font-semibold">Player:</span>
            <EditableField
              value={championsCharacter.player}
              onChange={(value) => updateCharacter('player', value)}
              className="text-black font-bold"
              placeholder="Player name..."
            />
          </div>
          
          <div className="text-4xl font-black text-black tracking-widest">
            <EditableField
              value={championsCharacter.name}
              onChange={(value) => updateCharacter('name', value)}
              className="text-4xl font-black text-black tracking-widest"
              placeholder="Character name..."
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-black font-semibold">Points:</span>
              <EditableField
                value={championsCharacter.experience?.available || 0}
                onChange={(value) => updateCharacter('experience.available', value)}
                className="text-black font-bold text-xl"
                type="number"
                min={0}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-black font-semibold">XP:</span>
              <EditableField
                value={championsCharacter.experience?.earned || 0}
                onChange={(value) => updateCharacter('experience.earned', value)}
                className="text-black font-bold text-xl"
                type="number"
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          
          {/* Left Column - Characteristics */}
          <div className="space-y-6">
            
            {/* Characteristics */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2 flex items-center">
                <Shield className="mr-2" size={20} />
                CHARACTERISTICS
              </h3>
              <div className="space-y-3">
                {Object.entries(championsCharacter.characteristics).map(([key, char]) => (
                  <div key={key} className="flex items-center justify-between bg-black/20 rounded p-2">
                    <span className="text-white font-semibold capitalize">{key}</span>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value={char.value}
                        onChange={(value) => updateCharacter(`characteristics.${key}.value`, value)}
                        className="text-white font-bold text-lg w-12 text-center"
                        type="number"
                        min={0}
                        max={50}
                      />
                      <span className="text-gray-400 text-sm">({char.cost})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2 flex items-center">
                <Brain className="mr-2" size={20} />
                SKILLS
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {championsCharacter.skills.map((skill, index) => (
                  <div key={skill._id ?? index} className="bg-black/20 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <EditableField
                        value={skill.name}
                        onChange={(value) => updateCharacter(`skills.${index}.name`, value)}
                        className="text-white font-semibold"
                        placeholder="Skill name..."
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div>
                        <div className="text-gray-300 text-xs">Type</div>
                        <EditableField
                          value={skill.type}
                          onChange={(value) => updateCharacter(`skills.${index}.type`, value)}
                          className="text-white text-xs"
                          placeholder="Type..."
                        />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Cost</div>
                        <EditableField
                          value={skill.cost}
                          onChange={(value) => updateCharacter(`skills.${index}.cost`, value)}
                          className="text-white text-xs"
                          type="number"
                          min={1}
                        />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Roll</div>
                        <EditableField
                          value={skill.roll}
                          onChange={(value) => updateCharacter(`skills.${index}.roll`, value)}
                          className="text-white text-xs"
                          placeholder="11-"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Powers */}
          <div className="space-y-6">
            
            {/* Powers */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2 flex items-center">
                <Zap className="mr-2" size={20} />
                POWERS
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {championsCharacter.powers.map((power, index) => (
                  <div key={power._id ?? index} className="bg-black/20 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <EditableField
                        value={power.name}
                        onChange={(value) => updateCharacter(`powers.${index}.name`, value)}
                        className="text-yellow-300 font-bold"
                        placeholder="Power name..."
                      />
                      {isEditing && (
                        <button
                          onClick={() => removePower(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                      <div>
                        <div className="text-gray-300 text-xs">Type</div>
                        <EditableField
                          value={power.type}
                          onChange={(value) => updateCharacter(`powers.${index}.type`, value)}
                          className="text-white text-xs"
                          placeholder="Attack, Defense, etc..."
                        />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Cost</div>
                        <EditableField
                          value={power.cost}
                          onChange={(value) => updateCharacter(`powers.${index}.cost`, value)}
                          className="text-white text-xs"
                          type="number"
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="mb-1">
                      <div className="text-gray-300 text-xs">END Cost</div>
                      <EditableField
                        value={power.end}
                        onChange={(value) => updateCharacter(`powers.${index}.end`, value)}
                        className="text-white text-xs"
                        type="number"
                        min={0}
                      />
                    </div>
                    <div>
                      <div className="text-gray-300 text-xs">Description</div>
                      <EditableField
                        value={power.description}
                        onChange={(value) => updateCharacter(`powers.${index}.description`, value)}
                        className="text-white text-xs w-full"
                        multiline
                        placeholder="Describe the power's effects and limitations..."
                      />
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <button
                    onClick={addPower}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Power</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Complications & Experience */}
          <div className="space-y-6">
            
            {/* Complications */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2 flex items-center">
                <Heart className="mr-2" size={20} />
                COMPLICATIONS
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {championsCharacter.complications.map((complication, index) => (
                  <div key={complication._id ?? index} className="bg-black/20 rounded p-2">
                    <div className="flex justify-between items-center mb-1">
                      <EditableField
                        value={complication.name}
                        onChange={(value) => updateCharacter(`complications.${index}.name`, value)}
                        className="text-white font-semibold"
                        placeholder="Complication name..."
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeComplication(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                      <div>
                        <div className="text-gray-300 text-xs">Type</div>
                        <EditableField
                          value={complication.type}
                          onChange={(value) => updateCharacter(`complications.${index}.type`, value)}
                          className="text-white text-xs"
                          placeholder="Psychological, Physical..."
                        />
                      </div>
                      <div>
                        <div className="text-gray-300 text-xs">Value</div>
                        <EditableField
                          value={complication.value}
                          onChange={(value) => updateCharacter(`complications.${index}.value`, value)}
                          className="text-white text-xs"
                          type="number"
                          min={5}
                          max={25}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-xs">Description</div>
                      <EditableField
                        value={complication.description}
                        onChange={(value) => updateCharacter(`complications.${index}.description`, value)}
                        className="text-white text-xs w-full"
                        multiline
                        placeholder="Describe the complication's impact..."
                      />
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <button
                    onClick={addComplication}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Complication</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Experience Summary */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg p-4">
              <h3 className="text-yellow-300 font-bold text-xl mb-4 border-b border-yellow-300/30 pb-2">
                EXPERIENCE SUMMARY
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-white font-semibold">Total Points Spent:</span>
                  <span className="text-yellow-300 font-bold">
                    {championsCharacter.experience?.spent || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-white font-semibold">Experience Earned:</span>
                  <span className="text-green-300 font-bold">
                    {championsCharacter.experience?.earned || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-black/20 rounded p-2">
                  <span className="text-white font-semibold">Available Points:</span>
                  <span className="text-blue-300 font-bold">
                    {championsCharacter.experience?.available || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionsSheet; 
import React from 'react';
import { ModularCharacterData, CharacterSheetProps } from './BaseCharacterSheet';
import { useLang, t } from '../../lib/i18n';

const GenericModularSheet: React.FC<CharacterSheetProps> = ({ character, isEditing, onCharacterChange, onToggleEdit }) => {
  const { lang } = useLang();
  const modular = character as ModularCharacterData;
  const abilities = modular.abilities ?? [];
  const handleChange = (field: keyof ModularCharacterData, value: string | number) => {
    onCharacterChange({ ...modular, [field]: value });
  };
  const handleAbilityChange = (idx: number, field: 'key' | 'name' | 'icon', value: string) => {
    const updated = abilities.map((ab, i) => i === idx ? { ...ab, [field]: value } : ab);
    onCharacterChange({ ...modular, abilities: updated });
  };
  const handleAddAbility = () => {
    const updated = [...abilities, { _id: crypto.randomUUID(), key: '', name: '', icon: '' }];
    onCharacterChange({ ...modular, abilities: updated });
  };
  const handleRemoveAbility = (idx: number) => {
    const updated = abilities.filter((_, i) => i !== idx);
    onCharacterChange({ ...modular, abilities: updated });
  };
  return (
    <div className="w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 overflow-auto">
      <div className="sheet max-w-xl w-full mx-auto bg-[#161c2b] border-4 border-blue-400 rounded-xl p-6 shadow-2xl overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center text-3xl font-bold text-blue-400 drop-shadow-lg">{t('generic.title', lang)}</h1>
          <button
            onClick={onToggleEdit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold"
          >
            {isEditing ? t('generic.save', lang) : t('generic.edit', lang)}
          </button>
        </div>
        <div className="group mb-4">
          <label htmlFor="nombre" className="block font-bold mb-1 text-blue-200">{t('generic.label.char_name', lang)}</label>
          <input type="text" id="nombre" name="nombre" value={modular.name} onChange={e => handleChange('name', e.target.value)} placeholder={t('generic.placeholder.char_name', lang)} disabled={!isEditing} className="w-full p-2 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <div className="group mb-4">
          <label htmlFor="grado" className="block font-bold mb-1 text-blue-200">{t('generic.label.power_level', lang)}</label>
          <select id="grado" name="grado" value={modular.grado} onChange={e => handleChange('grado', e.target.value)} disabled={!isEditing} className="w-full p-2 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="G1">{t('generic.grade.g1', lang)}</option>
            <option value="G3">{t('generic.grade.g3', lang)}</option>
            <option value="G5">{t('generic.grade.g5', lang)}</option>
            <option value="G7">{t('generic.grade.g7', lang)}</option>
            <option value="G10">{t('generic.grade.g10', lang)}</option>
          </select>
        </div>
        <div className="group mb-4">
          <label className="block font-bold mb-1 text-blue-200">{t('generic.label.attributes', lang)}</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="str" className="text-blue-100 text-xs">{t('generic.label.str', lang)}</label>
              <input type="number" id="str" name="str" min={0} max={10} value={modular.str} onChange={e => handleChange('str', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="end" className="text-blue-100 text-xs">{t('generic.label.end', lang)}</label>
              <input type="number" id="end" name="end" min={0} max={10} value={modular.end} onChange={e => handleChange('end', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="agi" className="text-blue-100 text-xs">{t('generic.label.agi', lang)}</label>
              <input type="number" id="agi" name="agi" min={0} max={10} value={modular.agi} onChange={e => handleChange('agi', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="wil" className="text-blue-100 text-xs">{t('generic.label.wil', lang)}</label>
              <input type="number" id="wil" name="wil" min={0} max={10} value={modular.wil} onChange={e => handleChange('wil', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="int" className="text-blue-100 text-xs">{t('generic.label.int', lang)}</label>
              <input type="number" id="int" name="int" min={0} max={10} value={modular.int} onChange={e => handleChange('int', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="pre" className="text-blue-100 text-xs">{t('generic.label.pre', lang)}</label>
              <input type="number" id="pre" name="pre" min={0} max={10} value={modular.pre} onChange={e => handleChange('pre', Number(e.target.value))} disabled={!isEditing} className="w-full p-1 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
        </div>
        <div className="group mb-4">
          <label htmlFor="poderes" className="block font-bold mb-1 text-blue-200">{t('generic.label.powers', lang)}</label>
          <input type="text" id="poderes" name="poderes" value={modular.poderes} onChange={e => handleChange('poderes', e.target.value)} placeholder={t('generic.placeholder.powers', lang)} disabled={!isEditing} className="w-full p-2 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <div className="group mb-4">
          <label htmlFor="ventajas" className="block font-bold mb-1 text-blue-200">{t('generic.label.advantages', lang)}</label>
          <input type="text" id="ventajas" name="ventajas" value={modular.ventajas} onChange={e => handleChange('ventajas', e.target.value)} placeholder={t('generic.placeholder.advantages', lang)} disabled={!isEditing} className="w-full p-2 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <div className="group mb-4">
          <label htmlFor="descripcion" className="block font-bold mb-1 text-blue-200">{t('generic.label.description', lang)}</label>
          <input type="text" id="descripcion" name="descripcion" value={modular.descripcion} onChange={e => handleChange('descripcion', e.target.value)} placeholder={t('generic.placeholder.description', lang)} disabled={!isEditing} className="w-full p-2 rounded bg-[#292f45] border-2 border-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <div className="abilities-section bg-[#202a40] border-2 border-blue-400 rounded-lg mt-6 p-4">
          <h2 className="text-blue-400 text-xl font-bold border-b border-blue-400 pb-1 mb-4">{t('generic.label.combat_abilities', lang)}</h2>
          <div className="box-xo2 max-h-48 overflow-auto space-y-2">
            {abilities.map((ab, idx) => (
              <div key={ab._id ?? idx} className="ability-entry flex flex-col md:flex-row md:items-center gap-2 md:gap-3 p-2 bg-[#1c2233] rounded mb-1 border border-blue-700">
                <div className="flex gap-2 items-center w-full md:w-auto">
                  <input type="text" className="key w-14 text-center font-bold text-blue-400 bg-[#0d111a] border border-blue-400 rounded disabled:opacity-50 disabled:cursor-not-allowed" value={ab.key} onChange={e => handleAbilityChange(idx, 'key', e.target.value)} placeholder={t('generic.placeholder.key', lang)} disabled={!isEditing} />
                  <input type="text" className="icon-url w-40 bg-[#0d111a] border border-blue-400 rounded p-1 text-white disabled:opacity-50 disabled:cursor-not-allowed" value={ab.icon} onChange={e => handleAbilityChange(idx, 'icon', e.target.value)} placeholder={t('generic.placeholder.icon_url', lang)} disabled={!isEditing} />
                  <img src={ab.icon} alt="Ability Icon" className="w-10 h-10 object-cover rounded border-2 border-blue-400" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <input type="text" className="name flex-1 uppercase font-bold bg-[#0d111a] border border-blue-400 rounded p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed" value={ab.name} onChange={e => handleAbilityChange(idx, 'name', e.target.value)} placeholder={t('generic.placeholder.ability_name', lang)} disabled={!isEditing} />
                {isEditing && (
                  <button type="button" className="ml-2 text-red-400 hover:text-red-200 font-bold" onClick={() => handleRemoveAbility(idx)} title="Remove">✕</button>
                )}
              </div>
            ))}
            {isEditing && (
              <button type="button" className="mt-2 w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 rounded" onClick={handleAddAbility}>{t('generic.btn.add_ability', lang)}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericModularSheet; 
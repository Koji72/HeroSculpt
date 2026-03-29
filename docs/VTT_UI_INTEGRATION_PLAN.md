# 🎨 Plan de Integración UI para VTT/Roll20

## 🎯 Objetivo

Adaptar la interfaz actual del Superhero 3D Customizer para integrar funcionalidades VTT/Roll20 de manera fluida y profesional, manteniendo la estética gaming existente.

---

## 📊 Análisis de la UI Actual

### **✅ Elementos Existentes:**
- **Header Marvel-style** con botones principales
- **Sistema de navegación** por categorías
- **Panel 3D** central
- **Sidebar** de arquetipos
- **Dropdown de usuario** con opciones
- **Estética gaming** con gradientes y efectos

### **🎮 Estilo Visual Actual:**
- **Colores**: Slate-900/800 con acentos naranja/cyan
- **Efectos**: Holográficos, blur, gradientes
- **Tipografía**: RefrigeratorDeluxeBold
- **Botones**: Clip-path, hover effects, glow

---

## 🚀 Cambios UI Propuestos

### **1. Header Principal - Nuevos Botones VTT** 🎯

#### **Botón "VTT Export"**
```typescript
// Nuevo botón en el header principal
<button
  onClick={handleOpenVTTExport}
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-md transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 hover:scale-105 hover:shadow-lg hover:shadow-emerald-400/50 relative overflow-hidden group"
  style={{ 
    fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
  <DiceIcon className="h-5 w-5 relative z-10" />
  <span className="hidden sm:inline relative z-10">VTT Export</span>
</button>
```

#### **Botón "Roll20 Sync"**
```typescript
<button
  onClick={handleOpenRoll20Sync}
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-md transition-all duration-300 hover:from-blue-500 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/50 relative overflow-hidden group"
  style={{ 
    fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
  }}
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
  <GamepadIcon className="h-5 w-5 relative z-10" />
  <span className="hidden sm:inline relative z-10">Roll20</span>
</button>
```

### **2. Dropdown de Usuario - Nuevas Opciones** 👤

#### **Agregar al HeaderDropdown:**
```typescript
// Nuevas opciones en el dropdown
<button 
  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2" 
  onClick={onOpenVTTLibrary}
>
  <DiceIcon className="h-5 w-5" /> Tokens VTT
</button>
<button 
  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2" 
  onClick={onOpenRoll20Settings}
>
  <GamepadIcon className="h-5 w-5" /> Roll20 Settings
</button>
<button 
  className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 flex items-center gap-2" 
  onClick={onOpenVTTMaps}
>
  <MapIcon className="h-5 w-5" /> Mapas VTT
</button>
```

### **3. Panel VTT Export - Nuevo Modal** 🎨

#### **Componente VTTExportModal:**
```typescript
interface VTTExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: RPGCharacterSync;
  onExportToken: (format: string, size: number) => void;
  onExportCharacter: (system: string, format: string) => void;
}

const VTTExportModal: React.FC<VTTExportModalProps> = ({
  isOpen,
  onClose,
  character,
  onExportToken,
  onExportCharacter
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center gap-2">
            <DiceIcon className="h-6 w-6" />
            Exportar para VTT
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Token Export */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TargetIcon className="h-5 w-5" />
                Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formatos */}
              <div>
                <label className="text-slate-300 text-sm font-medium">Formato</label>
                <select className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2">
                  <option value="png">PNG (Recomendado)</option>
                  <option value="webp">WebP (Optimizado)</option>
                  <option value="svg">SVG (Vectorial)</option>
                </select>
              </div>
              
              {/* Tamaños */}
              <div>
                <label className="text-slate-300 text-sm font-medium">Tamaño</label>
                <select className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2">
                  <option value="256">256px (Roll20)</option>
                  <option value="512">512px (Alta calidad)</option>
                  <option value="1024">1024px (Premium)</option>
                </select>
              </div>
              
              <Button 
                onClick={() => onExportToken('png', 256)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Exportar Token
              </Button>
            </CardContent>
          </Card>
          
          {/* Character Sheet Export */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Hoja de Personaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sistema RPG */}
              <div>
                <label className="text-slate-300 text-sm font-medium">Sistema</label>
                <select className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2">
                  <option value="dnd5e">D&D 5e</option>
                  <option value="pathfinder">Pathfinder 2e</option>
                  <option value="mnm">Mutants & Masterminds</option>
                  <option value="champions">Champions</option>
                </select>
              </div>
              
              {/* Formato */}
              <div>
                <label className="text-slate-300 text-sm font-medium">Formato</label>
                <select className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2">
                  <option value="json">JSON (Roll20)</option>
                  <option value="xml">XML (Foundry)</option>
                  <option value="pdf">PDF (Imprimir)</option>
                </select>
              </div>
              
              <Button 
                onClick={() => onExportCharacter('dnd5e', 'json')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Exportar Hoja
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### **4. Panel Roll20 Sync - Integración Directa** 🎲

#### **Componente Roll20SyncPanel:**
```typescript
interface Roll20SyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  character: RPGCharacterSync;
  onSyncToRoll20: (characterId: string) => void;
}

const Roll20SyncPanel: React.FC<Roll20SyncPanelProps> = ({
  isOpen,
  onClose,
  character,
  onSyncToRoll20
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center gap-2">
            <GamepadIcon className="h-6 w-6" />
            Sincronizar con Roll20
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Character Preview */}
          <Card className="bg-slate-800/50 border-slate-600 p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">{character.name}</h3>
                <p className="text-slate-400 text-sm">{character.archetypeId}</p>
              </div>
            </div>
          </Card>
          
          {/* Sync Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sync-token" defaultChecked className="rounded" />
              <label htmlFor="sync-token" className="text-slate-300">Sincronizar token</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sync-stats" defaultChecked className="rounded" />
              <label htmlFor="sync-stats" className="text-slate-300">Sincronizar estadísticas</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sync-sheet" defaultChecked className="rounded" />
              <label htmlFor="sync-sheet" className="text-slate-300">Crear hoja de personaje</label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => onSyncToRoll20(character.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
            >
              <GamepadIcon className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### **5. Biblioteca VTT - Nueva Sección** 📚

#### **Componente VTTLibrary:**
```typescript
interface VTTLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: VTTToken[];
  onLoadToken: (token: VTTToken) => void;
  onDeleteToken: (tokenId: string) => void;
}

const VTTLibrary: React.FC<VTTLibraryProps> = ({
  isOpen,
  onClose,
  tokens,
  onLoadToken,
  onDeleteToken
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center gap-2">
            <DiceIcon className="h-6 w-6" />
            Biblioteca de Tokens VTT
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Todos
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Roll20
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Foundry
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Fantasy Grounds
            </Button>
          </div>
          
          {/* Token Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {tokens.map((token) => (
              <Card key={token.id} className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors">
                <CardContent className="p-3">
                  <div className="aspect-square bg-slate-700 rounded-lg mb-2 flex items-center justify-center">
                    <img 
                      src={token.tokenImage} 
                      alt={token.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-white font-medium text-sm truncate">{token.name}</h3>
                  <p className="text-slate-400 text-xs">{token.character.archetypeId}</p>
                  
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onLoadToken(token)}
                      className="flex-1 h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cargar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDeleteToken(token.id)}
                      className="h-7 w-7 p-0 border-red-600 text-red-400 hover:bg-red-600/20"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### **6. Panel de Mapas VTT** 🗺️

#### **Componente VTTMapGenerator:**
```typescript
interface VTTMapGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateMap: (theme: string, size: { width: number; height: number }) => void;
}

const VTTMapGenerator: React.FC<VTTMapGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerateMap
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white flex items-center gap-2">
            <MapIcon className="h-6 w-6" />
            Generador de Mapas VTT
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Theme Selection */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Tema del Mapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['urban', 'fantasy', 'scifi', 'dungeon'].map((theme) => (
                <Button
                  key={theme}
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </CardContent>
          </Card>
          
          {/* Size Configuration */}
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Tamaño del Mapa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium">Ancho (píxeles)</label>
                <input 
                  type="number" 
                  defaultValue={1024}
                  className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">Alto (píxeles)</label>
                <input 
                  type="number" 
                  defaultValue={1024}
                  className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">Tamaño de Grid</label>
                <select className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2">
                  <option value="50">50px (Estándar)</option>
                  <option value="70">70px (Grande)</option>
                  <option value="100">100px (Enorme)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={() => onGenerateMap('fantasy', { width: 1024, height: 1024 })}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Generar Mapa
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🎨 Adaptaciones de Estilo

### **1. Nuevos Iconos VTT**
```typescript
// Agregar a lucide-react imports
import { 
  Dice, 
  Gamepad, 
  Map, 
  Target, 
  FileText, 
  Download,
  Trash,
  Sparkles
} from 'lucide-react';
```

### **2. Colores VTT**
```css
/* Nuevos colores para VTT */
.vtt-emerald {
  @apply bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400;
}

.vtt-blue {
  @apply bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400;
}

.vtt-purple {
  @apply bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400;
}
```

### **3. Efectos VTT**
```css
/* Efectos especiales para VTT */
.vtt-glow {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.vtt-hover {
  transition: all 0.3s ease;
}

.vtt-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}
```

---

## 📱 Responsive Design

### **1. Mobile Adaptations**
```typescript
// Botones que se ocultan en mobile
<span className="hidden sm:inline relative z-10">VTT Export</span>

// Grid responsive para tokens
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

### **2. Tablet Optimizations**
```typescript
// Modales que se adaptan
<DialogContent className="sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
```

---

## 🚀 Implementación Prioritaria

### **Fase 1 (Semana 1):**
1. **Agregar botones VTT** al header principal
2. **Crear VTTExportModal** básico
3. **Actualizar HeaderDropdown** con opciones VTT

### **Fase 2 (Semana 2):**
1. **Implementar Roll20SyncPanel**
2. **Crear VTTLibrary** básica
3. **Agregar estilos VTT** específicos

### **Fase 3 (Semana 3):**
1. **Desarrollar VTTMapGenerator**
2. **Optimizar responsive design**
3. **Testing y refinamiento**

---

## 🎯 Beneficios de la Integración UI

### **Para Usuarios:**
- **Acceso directo** a funcionalidades VTT
- **Interfaz familiar** y consistente
- **Workflow fluido** entre customización y exportación

### **Para el Proyecto:**
- **Posicionamiento** como herramienta VTT completa
- **Retención** de usuarios gaming
- **Monetización** de funcionalidades premium

### **Para la Comunidad:**
- **Herramienta única** en el mercado
- **Integración nativa** con VTT populares
- **Ecosistema completo** de creación y exportación 
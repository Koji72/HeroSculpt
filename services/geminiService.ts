import { HeroIdea } from '../types';

// Mock service for now - in production this would use the actual Gemini API
export const generateHeroIdea = async (): Promise<HeroIdea | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock hero ideas
    const heroIdeas: HeroIdea[] = [
      {
        name: "Cyber Phoenix",
        backstory: "Un guerrero cyborg que renació de las cenizas de la guerra tecnológica, combinando la gracia de un ave fénix con la precisión de la nanotecnología.",
        visuals: {
          armorStyle: "Sleek Nanotech",
          primaryColor: "#FF6B35",
          secondaryColor: "#00D4FF",
          accessories: ["Plasma Wings", "Neural Interface", "Energy Sword"]
        }
      },
      {
        name: "Quantum Guardian",
        backstory: "Protector de las fronteras dimensionales, capaz de manipular el espacio-tiempo para defender la realidad de amenazas interdimensionales.",
        visuals: {
          armorStyle: "Quantum Plates",
          primaryColor: "#8A2BE2",
          secondaryColor: "#00FFFF",
          accessories: ["Dimensional Shield", "Time Manipulator", "Quantum Cape"]
        }
      },
      {
        name: "Bio-Mystic",
        backstory: "Héroe que fusiona la magia ancestral con la biotecnología moderna, creando poderes únicos que desafían las leyes de la naturaleza.",
        visuals: {
          armorStyle: "Living Armor",
          primaryColor: "#32CD32",
          secondaryColor: "#FFD700",
          accessories: ["Crystal Staff", "Living Cape", "Mystic Runes"]
        }
      },
      {
        name: "Neon Shadow",
        backstory: "Vigilante urbano que utiliza la tecnología de sigilo más avanzada para luchar contra el crimen en las calles de la ciudad del futuro.",
        visuals: {
          armorStyle: "Stealth Nanosuit",
          primaryColor: "#FF1493",
          secondaryColor: "#00FF00",
          accessories: ["Holographic Cloak", "Neural Disruptor", "Shadow Daggers"]
        }
      },
      {
        name: "Cosmic Paladin",
        backstory: "Defensor de la justicia cósmica, armado con tecnología sagrada que combina la fe ancestral con la ciencia de las estrellas.",
        visuals: {
          armorStyle: "Sacred Tech",
          primaryColor: "#FFD700",
          secondaryColor: "#4169E1",
          accessories: ["Holy Blade", "Cosmic Shield", "Stellar Aura"]
        }
      }
    ];
    
    // Return a random hero idea
    const randomIndex = Math.floor(Math.random() * heroIdeas.length);
    return heroIdeas[randomIndex];
    
  } catch (error) {
    if (import.meta.env.DEV) console.error("Error generating hero idea:", error);
    return null;
  }
}; 
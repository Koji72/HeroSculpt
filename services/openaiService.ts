import OpenAI from 'openai';
import { SelectedParts, Part, PartCategory, ArchetypeId } from '../types';

// Crear cliente de OpenAI solo si la API key está disponible
let openai: OpenAI | null = null;

if ((import.meta as any).env.VITE_OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: (import.meta as any).env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Solo para desarrollo
    });
  } catch (error) {
    console.warn('Error creating OpenAI client:', error);
  }
} else {
  console.warn('OpenAI API key not found. AI Designer will be disabled.');
}

// Mapeo de categorías para convertir entre nombres legibles y enum
const CATEGORY_MAPPING: { [key: string]: PartCategory } = {
  'Torso': PartCategory.TORSO,
  'Suit Torso': PartCategory.SUIT_TORSO,
  'Lower Body': PartCategory.LOWER_BODY,
  'Head': PartCategory.HEAD,
  'Hand Left': PartCategory.HAND_LEFT,
  'Hand Right': PartCategory.HAND_RIGHT,
  'Cape': PartCategory.CAPE,
  'Backpack': PartCategory.BACKPACK,
  'Chest Belt': PartCategory.CHEST_BELT,
  'Belt': PartCategory.BELT,
  'Buckle': PartCategory.BUCKLE,
  'Pouch': PartCategory.POUCH,
  'Shoulders': PartCategory.SHOULDERS,
  'Forearms': PartCategory.FOREARMS,
  'Boots': PartCategory.BOOTS,
  'Symbol': PartCategory.SYMBOL,
};

export const generateBuild = async (prompt: string, allParts: Part[], archetype: ArchetypeId): Promise<SelectedParts> => {
  if (!openai) {
    throw new Error("AI service is not available. Please check your OpenAI API key configuration.");
  }

  console.log(`🔍 AI Designer Debug: Sending prompt to OpenAI API for archetype ${archetype}: "${prompt}"`);

  const relevantParts = allParts.filter(p => p.archetype === archetype);
  if (relevantParts.length === 0) {
      console.error(`❌ No parts found for archetype ${archetype}`);
      throw new Error(`No parts available for archetype "${archetype}".`);
  }

  console.log(`📊 Found ${relevantParts.length} parts for archetype ${archetype}`);

  const partManifest = relevantParts.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    priceUSD: p.priceUSD
  }));

  // Obtener categorías únicas disponibles
  const availableCategories = [...new Set(relevantParts.map(p => p.category))];
  console.log(`📋 Available categories:`, availableCategories);

  const systemPrompt = `You are an expert superhero designer for the Strong archetype. Your task is to select parts to create a superhero character based on a user's description.

You will be given a user's prompt, the Strong archetype, and a list of all available parts.
You must select exactly one part for each of the following required categories: ${availableCategories.join(', ')}.

Based on the user's prompt, choose the best part for each category from the provided list.
You MUST return a JSON object where the keys are the part categories and the values are the string ID of your chosen part.

Example format: { "TORSO": "strong_torso_01", "LOWER_BODY": "strong_legs_01", "CAPE": "none", ... }

IMPORTANT PART NAMING CONVENTIONS:
- Torso parts: strong_torso_01, strong_torso_02, strong_torso_03, strong_torso_04, strong_torso_05
- Suit torso parts: strong_suit_torso_01_t01, strong_suit_torso_02_t01, strong_suit_torso_03_t01, etc.
- Legs: strong_legs_01, strong_legs_02, strong_legs_03, strong_legs_04, strong_legs_05, strong_legs_06
- Boots: strong_boots_01_l01, strong_boots_02_l02, strong_boots_03_l03, strong_boots_04_l04, etc.
- Head: strong_head_01_t01, strong_head_01_t03, strong_head_01_t04, strong_head_01_t05, etc.
- Hands follow this pattern: strong_hands_[weapon]_[variant]_t[torso]_[side]_[glove]
  * Weapons: hammer, pistol, fist
  * Variants: 01, 02, 03, 04
  * Torso: t01, t02, t03, t04, t05
  * Side: l (left), r (right)
  * Glove: g (with glove), ng (no glove)
  * Examples: strong_hands_hammer_01_t01_r_ng, strong_hands_pistol_01_t01_l_g
- Cape: strong_cape_01_t01, strong_cape_02_t01, strong_cape_03_t01, strong_cape_04_t01, etc.
- Belt: strong_belt_01, strong_belt_02, strong_belt_03, strong_belt_04, strong_belt_05, strong_belt_06
- Buckle: strong_buckle_01, strong_buckle_02, strong_buckle_03, strong_buckle_04, strong_buckle_05, strong_buckle_06
- Pouch: strong_pouch_01, strong_pouch_02, strong_pouch_03, strong_pouch_04, strong_pouch_05, strong_pouch_06
- Symbol: strong_symbol_01, strong_symbol_02, strong_symbol_03, strong_symbol_04, strong_symbol_05
- Chest Belt: strong_beltchest_01, strong_beltchest_01_t01, strong_beltchest_01_t02, etc.

CRITICAL RULES:
1. If the user mentions "no cape", "without cape", "sin capa", use "none" for CAPE
2. If the user mentions "no weapon", "unarmed", "sin arma", use "none" for weapon categories
3. If the user mentions "no symbol", "sin símbolo", use "none" for SYMBOL
4. For hands, consider the user's weapon preferences:
   - "hammer" or "martillo" → select hammer variants
   - "pistol" or "pistola" → select pistol variants
   - "fist" or "puño" → select fist variants
   - "glove" or "guante" → use _g suffix
   - "no glove" or "sin guante" → use _ng suffix
5. Consider torso compatibility: hands, head, cape, and symbols depend on the selected torso
6. Do not invent new part IDs. Only use IDs from the provided list or "none" for missing parts
7. Ensure all required categories are filled
8. Use the exact category names as shown in the list
9. Return ONLY the JSON object, no additional text or explanations`;

  const userPrompt = `User's character description: "${prompt}".
The character archetype is "${archetype}".

Here is the list of all available parts you can choose from for this archetype:
${JSON.stringify(partManifest, null, 2)}

Required categories: ${availableCategories.join(', ')}

Please select the best parts for each category based on the user's description and return ONLY a JSON object.`;

  try {
    console.log(`🤖 Calling OpenAI API...`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usando GPT-4o-mini para mejor rendimiento
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const jsonStr = response.choices[0]?.message?.content;
    if (!jsonStr) {
      throw new Error("No response received from AI service");
    }

    console.log(`📥 Raw AI response:`, jsonStr);

    const partIdMap = JSON.parse(jsonStr) as { [key: string]: string };
    console.log(`🔧 Parsed AI response:`, partIdMap);
    
    const newBuild: SelectedParts = {};
    let validSelections = 0;
    
    for (const categoryKey in partIdMap) {
        const partId = partIdMap[categoryKey];
        
        // Intentar mapear la categoría
        let mappedCategory = categoryKey as PartCategory;
        
        // Si no es una categoría válida, intentar mapear
        if (!Object.values(PartCategory).includes(mappedCategory)) {
            mappedCategory = CATEGORY_MAPPING[categoryKey] || categoryKey as PartCategory;
        }
        
        if (Object.values(PartCategory).includes(mappedCategory)) {
            let foundPart = relevantParts.find(p => p.id === partId);
            
            // Si no se encuentra la parte y el ID es "none", crear una parte virtual "none"
            if (!foundPart && partId === "none") {
                foundPart = {
                    id: `strong_${mappedCategory.toLowerCase()}_none_01`,
                    name: `No ${mappedCategory.charAt(0).toUpperCase() + mappedCategory.slice(1).toLowerCase()}`,
                    category: mappedCategory,
                    archetype: archetype,
                    gltfPath: '', // Sin modelo 3D
                    priceUSD: 0,
                    compatible: [],
                    thumbnail: `https://picsum.photos/seed/none_${mappedCategory}/100/100`,
                    attributes: { none: true }
                };
                console.log(`🎭 Created virtual "none" part for ${mappedCategory}: ${foundPart.id}`);
            }
            
            if (foundPart) {
                newBuild[mappedCategory] = foundPart;
                validSelections++;
                console.log(`✅ Selected ${mappedCategory}: ${foundPart.id} (${foundPart.name})`);
            } else {
                console.warn(`⚠️ AI selected part ID "${partId}" for category "${mappedCategory}", but it was not found in the relevant parts for archetype ${archetype}.`);
            }
        } else {
            console.warn(`⚠️ Unknown category "${categoryKey}" in AI response`);
        }
    }
    
    console.log(`📊 AI generated ${validSelections} valid selections out of ${availableCategories.length} required categories`);
    console.log("🎯 Final AI-generated build:", newBuild);
    
    // Verificar que tenemos todas las categorías requeridas
    const missingCategories = availableCategories.filter(cat => !newBuild[cat]);
    if (missingCategories.length > 0) {
        console.warn(`⚠️ Missing categories: ${missingCategories.join(', ')}`);
    }
    
    return newBuild;

  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("Invalid OpenAI API key. Please check your configuration.");
      } else if (error.message.includes('quota')) {
        throw new Error("OpenAI API quota exceeded. Please check your account.");
      }
    }
    throw new Error("Failed to generate build from AI. Please try again.");
  }
};

// Función para verificar si el servicio de IA está disponible
export const isAIServiceAvailable = (): boolean => {
  return openai !== null && !!(import.meta as any).env.VITE_OPENAI_API_KEY;
}; 
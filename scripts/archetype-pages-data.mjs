export const SITE_DOMAIN = 'https://herosculpt.com'; // ← update with real domain

export const ARCHETYPES = [
  {
    id: 'STRONG',
    slug: 'sentinel',
    name: 'Sentinel',
    icon: '💪',
    theme: ['Tank', 'Strength', 'Defense'],
    stats: { power: 95, defense: 90, speed: 60, intelligence: 70, energy: 75 },
    en: {
      title: 'The Powerhouse',
      metaDesc: 'Design a Sentinel powerhouse hero in HeroSculpt\'s free 3D superhero creator. Super strength, invulnerability, earthquake slam — build and export your character.',
      description: 'Raw strength and unbreakable defense. The most resilient and powerful archetype on the battlefield.',
      abilities: { primary: 'Super Strength', secondary: 'Invulnerability', ultimate: 'Earthquake Slam', passive: 'Unbreakable Will' },
      examples: ['Superman', 'Hulk', 'Thor'],
      tips: [
        'Layer heavy armor plates over a broad muscular torso for maximum intimidation.',
        'Bold primary colors — red, blue, gold — read as heroic at a distance.',
        'Skip the cape: Sentinel builds feel more grounded with a thick neck guard instead.'
      ],
    },
    es: {
      title: 'El Coloso',
      metaDesc: 'Diseña un héroe Sentinel en HeroSculpt, el creador de superhéroes 3D gratuito. Superfuerza, invulnerabilidad y golpe sísmico. Construye y exporta tu personaje.',
      description: 'Fuerza bruta y defensa invulnerable. El tipo de personaje más resistente y poderoso del campo de batalla.',
      abilities: { primary: 'Superfuerza', secondary: 'Invulnerabilidad', ultimate: 'Golpe Sísmico', passive: 'Voluntad Inquebrantable' },
      examples: ['Superman', 'Hulk', 'Thor'],
      tips: [
        'Superpón armadura pesada sobre un torso musculoso para máxima intimidación.',
        'Los colores primarios —rojo, azul, dorado— transmiten heroísmo a distancia.',
        'Prueba sin capa: el Sentinel se ve más sólido con un guardacuello grueso.'
      ],
    },
  },
  {
    id: 'JUSTICIERO',
    slug: 'phantom',
    name: 'Phantom',
    icon: '⚖️',
    theme: ['Guardian', 'Justice', 'Protection'],
    stats: { power: 80, defense: 85, speed: 75, intelligence: 85, energy: 70 },
    en: {
      title: 'The Guardian',
      metaDesc: 'Create a Phantom guardian hero in HeroSculpt\'s free 3D character creator. Justice strike, protective aura, leadership — customize and export your hero.',
      description: 'Justice and protection for all. A born leader with protective powers and an inspiring aura.',
      abilities: { primary: 'Justice Strike', secondary: 'Protective Aura', ultimate: "Guardian's Call", passive: 'Inspiring Presence' },
      examples: ['Captain America', 'Wonder Woman', 'Black Panther'],
      tips: [
        'A full cape paired with chest armor communicates authority and protection.',
        'Deep blues and golds are the classic justice palette — they signal trustworthiness.',
        'Add a shield accessory or chest symbol to anchor the guardian silhouette.'
      ],
    },
    es: {
      title: 'El Guardián',
      metaDesc: 'Crea un héroe Phantom guardián en HeroSculpt, el creador 3D gratuito. Golpe de justicia, aura protectora y liderazgo. Personaliza y exporta.',
      description: 'Justicia y protección para todos. Líder nato con poderes de protección y aura inspiradora.',
      abilities: { primary: 'Golpe de Justicia', secondary: 'Aura Protectora', ultimate: 'Llamada del Guardián', passive: 'Presencia Inspiradora' },
      examples: ['Capitán América', 'Wonder Woman', 'Pantera Negra'],
      tips: [
        'Una capa completa con armadura de pecho transmite autoridad y protección.',
        'Azules profundos y dorados son la paleta clásica de la justicia.',
        'Añade un escudo o símbolo de pecho para anclar la silueta de guardián.'
      ],
    },
  },
  {
    id: 'SPEEDSTER',
    slug: 'blitz',
    name: 'Blitz',
    icon: '⚡',
    theme: ['Speed', 'Agility', 'Mobility'],
    stats: { power: 70, defense: 60, speed: 98, intelligence: 75, energy: 80 },
    en: {
      title: 'The Flash',
      metaDesc: "Build a Blitz speedster hero in HeroSculpt's free 3D superhero creator. Lightning speed, hyper-reflexes, time warp — design and export your character.",
      description: 'Lightning speed and extreme agility. The fastest warrior on the battlefield.',
      abilities: { primary: 'Lightning Strike', secondary: 'Speed Force', ultimate: 'Time Warp', passive: 'Hyper Reflexes' },
      examples: ['Flash', 'Quicksilver', 'Sonic'],
      tips: [
        'Streamlined, form-fitting suits with lightning bolt accents reinforce the speed motif.',
        'Avoid bulky shoulder pads — they break the aerodynamic silhouette.',
        'Yellow, electric blue, or white convey motion better than dark colors.'
      ],
    },
    es: {
      title: 'El Relámpago',
      metaDesc: 'Diseña un héroe Blitz veloz en HeroSculpt, el creador de superhéroes 3D. Super velocidad, hiper-reflejos y distorsión temporal. Construye tu personaje.',
      description: 'Velocidad de rayo y agilidad extrema. El guerrero más rápido del campo de batalla.',
      abilities: { primary: 'Golpe Relámpago', secondary: 'Fuerza Velocidad', ultimate: 'Distorsión Temporal', passive: 'Hiper-Reflejos' },
      examples: ['Flash', 'Quicksilver', 'Sonic'],
      tips: [
        'Trajes ajustados con detalles de rayos refuerzan el motivo de velocidad.',
        'Evita hombreras voluminosas — rompen la silueta aerodinámica.',
        'Amarillo, azul eléctrico o blanco transmiten movimiento mejor que los oscuros.'
      ],
    },
  },
  {
    id: 'MYSTIC',
    slug: 'arcane',
    name: 'Arcane',
    icon: '🔮',
    theme: ['Magic', 'Wisdom', 'Mysticism'],
    stats: { power: 88, defense: 70, speed: 75, intelligence: 95, energy: 90 },
    en: {
      title: 'The Sorcerer',
      metaDesc: "Design an Arcane sorcerer hero in HeroSculpt's free 3D creator. Mystic blast, rune shield, reality warp — build your magic-powered character.",
      description: 'Ancient magic and mystical powers. A master of the arcane arts and reality manipulation.',
      abilities: { primary: 'Mystic Blast', secondary: 'Rune Shield', ultimate: 'Reality Warp', passive: 'Arcane Knowledge' },
      examples: ['Doctor Strange', 'Scarlet Witch', 'Zatanna'],
      tips: [
        'Flowing robes or layered cloaks add mystical weight — avoid modern tech armor.',
        'Deep purples, indigos, and jewel tones evoke ancient magic.',
        'A glowing chest symbol or rune-etched gauntlets sell the spellcaster fantasy.'
      ],
    },
    es: {
      title: 'El Hechicero',
      metaDesc: 'Crea un héroe Arcane hechicero en HeroSculpt, el creador 3D gratuito. Explosión mística, escudo de runas y distorsión de realidad. Diseña tu mago.',
      description: 'Magia antigua y poderes místicos. Un maestro de las artes arcanas y la manipulación de la realidad.',
      abilities: { primary: 'Explosión Mística', secondary: 'Escudo de Runas', ultimate: 'Distorsión de Realidad', passive: 'Conocimiento Arcano' },
      examples: ['Doctor Strange', 'Bruja Escarlata', 'Zatanna'],
      tips: [
        'Las túnicas o capas con capas añaden peso místico — evita la armadura tecnológica.',
        'Púrpuras profundos, índigos y tonos joya evocan la magia antigua.',
        'Un símbolo de pecho brillante o guanteletes con runas venden la fantasía del hechicero.'
      ],
    },
  },
  {
    id: 'TECH',
    slug: 'ghost',
    name: 'Ghost',
    icon: '🤖',
    theme: ['Technology', 'Intelligence', 'Innovation'],
    stats: { power: 85, defense: 80, speed: 82, intelligence: 98, energy: 85 },
    en: {
      title: 'The Inventor',
      metaDesc: "Create a Ghost tech hero in HeroSculpt's free 3D superhero creator. Tech blast, shield generator, nanotech swarm — design your inventor character.",
      description: 'Advanced technology and constant innovation. The inventor who turns gadgets into devastating weapons.',
      abilities: { primary: 'Tech Blast', secondary: 'Shield Generator', ultimate: 'Nanotech Swarm', passive: 'Technological Mastery' },
      examples: ['Iron Man', 'Batman', 'Mr. Fantastic'],
      tips: [
        'Segmented armor panels with visible tech details signal engineering mastery.',
        'Cyan, gunmetal, and white reflect the machine aesthetic without looking robotic.',
        'Keep the silhouette sharp and angular — organic curves undercut the tech feel.'
      ],
    },
    es: {
      title: 'El Inventor',
      metaDesc: 'Diseña un héroe Ghost tecnológico en HeroSculpt, el creador 3D. Explosión tecnológica, generador de escudos y enjambre de nanotecnología. Crea tu inventor.',
      description: 'Tecnología avanzada e innovación constante. El inventor que convierte gadgets en armas devastadoras.',
      abilities: { primary: 'Explosión Tecnológica', secondary: 'Generador de Escudos', ultimate: 'Enjambre Nanotec', passive: 'Maestría Tecnológica' },
      examples: ['Iron Man', 'Batman', 'Sr. Fantástico'],
      tips: [
        'Los paneles de armadura segmentados con detalles tecnológicos señalan maestría.',
        'El cian, acero y blanco reflejan la estética de máquina sin parecer robótico.',
        'Mantén la silueta afilada y angular — las curvas orgánicas socavan el aspecto tech.'
      ],
    },
  },
  {
    id: 'PARAGON',
    slug: 'titan',
    name: 'Titan',
    icon: '🦸',
    theme: ['Heroism', 'Balance', 'Perfection'],
    stats: { power: 90, defense: 85, speed: 85, intelligence: 80, energy: 85 },
    en: {
      title: 'The Perfect Hero',
      metaDesc: "Build a Titan paragon hero in HeroSculpt's free 3D character creator. Heroic strike, flight, paragon's justice — design the perfect balanced superhero.",
      description: 'The ultimate balanced hero. Strong, fast, and inspiring — the pinnacle of all superhero archetypes.',
      abilities: { primary: 'Heroic Strike', secondary: 'Flight', ultimate: "Paragon's Justice", passive: 'Inspiring Hero' },
      examples: ['Superman', 'Captain Marvel', 'Wonder Woman'],
      tips: [
        'The classic cape-and-symbol combo is non-negotiable for the perfect hero archetype.',
        'Primary colors work best: bold red, blue, or gold with white accents.',
        'An upright broad-shouldered torso with zero bulky accessories keeps the noble look clean.'
      ],
    },
    es: {
      title: 'El Héroe Perfecto',
      metaDesc: 'Crea un héroe Titan parangón en HeroSculpt, el creador de superhéroes 3D gratuito. Golpe heroico, vuelo y justicia perfecta. Diseña el héroe equilibrado.',
      description: 'El héroe equilibrado y perfecto. Fuerte, veloz e inspirador — el parangón de todos los superhéroes.',
      abilities: { primary: 'Golpe Heroico', secondary: 'Vuelo', ultimate: 'Justicia del Titán', passive: 'Héroe Inspirador' },
      examples: ['Superman', 'Capitana Marvel', 'Wonder Woman'],
      tips: [
        'La combinación clásica de capa y símbolo es imprescindible para el héroe perfecto.',
        'Los colores primarios funcionan mejor: rojo, azul o dorado con acentos blancos.',
        'Un torso erguido de hombros anchos sin accesorios voluminosos mantiene el aspecto noble.'
      ],
    },
  },
  {
    id: 'ENERGY_PRO',
    slug: 'energy-pro',
    name: 'Energy Pro',
    icon: '🔥',
    theme: ['Energy', 'Power', 'Destruction'],
    stats: { power: 85, defense: 70, speed: 80, intelligence: 75, energy: 95 },
    en: {
      title: 'The Energy Master',
      metaDesc: "Create an Energy Pro hero in HeroSculpt's free 3D superhero creator. Energy blast, plasma shield, supernova — design your energy-powered character.",
      description: 'Master of energy manipulation. Fires blasts of plasma and absorbs energy from the environment.',
      abilities: { primary: 'Energy Blast', secondary: 'Plasma Shield', ultimate: 'Supernova', passive: 'Energy Absorption' },
      examples: ['Cyclops', 'Human Torch', 'Storm'],
      tips: [
        'Minimal armor lets energy effects take center stage — keep the base suit simple.',
        'Orange, yellow, and flame-red feel energetic — avoid black-heavy palettes.',
        'A streamlined torso with a glowing chest symbol makes the power source visible.'
      ],
    },
    es: {
      title: 'El Maestro Energético',
      metaDesc: 'Diseña un héroe Energy Pro en HeroSculpt, el creador 3D gratuito. Explosión de energía, escudo de plasma y supernova. Construye tu héroe energético.',
      description: 'Maestro de la manipulación de energía. Lanza explosiones de plasma y absorbe energía del entorno.',
      abilities: { primary: 'Explosión de Energía', secondary: 'Escudo de Plasma', ultimate: 'Supernova', passive: 'Absorción de Energía' },
      examples: ['Cíclope', 'Antorcha Humana', 'Tormenta'],
      tips: [
        'La armadura mínima permite que los efectos de energía sean el centro — mantén el traje simple.',
        'El naranja, amarillo y rojo llama se sienten energéticos — evita paletas oscuras.',
        'Un torso simplificado con símbolo de pecho brillante hace visible la fuente de poder.'
      ],
    },
  },
  {
    id: 'WEAPON_MASTER',
    slug: 'weapon-master',
    name: 'Weapon Master',
    icon: '⚔️',
    theme: ['Combat', 'Skill', 'Weapons'],
    stats: { power: 85, defense: 75, speed: 80, intelligence: 85, energy: 70 },
    en: {
      title: 'The Warrior',
      metaDesc: "Design a Weapon Master combat hero in HeroSculpt's free 3D creator. Weapon mastery, combat reflexes, weapon storm — build your warrior character.",
      description: 'Master of weapons and combat. No special powers — just skill, reflexes, and pure determination.',
      abilities: { primary: 'Weapon Mastery', secondary: 'Combat Reflexes', ultimate: 'Weapon Storm', passive: 'Combat Instinct' },
      examples: ['Batman', 'Hawkeye', 'Black Widow'],
      tips: [
        'Military tactical gear (pouches, belts, shoulder holsters) reads as combat-ready.',
        'Muted earth tones and grays ground the character in practical lethality.',
        'Symmetrical silhouettes suggest discipline — asymmetry suggests chaos, not mastery.'
      ],
    },
    es: {
      title: 'El Guerrero',
      metaDesc: 'Crea un Weapon Master en HeroSculpt, el creador de personajes 3D gratuito. Maestría en armas, reflejos de combate y tormenta de armas. Diseña tu guerrero.',
      description: 'Maestro de las armas y el combate. Sin poderes especiales, solo habilidad, reflejos y determinación.',
      abilities: { primary: 'Maestría en Armas', secondary: 'Reflejos de Combate', ultimate: 'Tormenta de Armas', passive: 'Instinto de Combate' },
      examples: ['Batman', 'Hawkeye', 'Viuda Negra'],
      tips: [
        'El equipo táctico militar (bolsillos, cinturones) transmite estar listo para el combate.',
        'Los tonos tierra y grises apagados anclan al personaje en la letalidad práctica.',
        'Las siluetas simétricas sugieren disciplina — la asimetría sugiere caos.'
      ],
    },
  },
  {
    id: 'SHAPESHIFTER',
    slug: 'shapeshifter',
    name: 'Shapeshifter',
    icon: '🦎',
    theme: ['Adaptation', 'Mutation', 'Change'],
    stats: { power: 80, defense: 75, speed: 85, intelligence: 80, energy: 75 },
    en: {
      title: 'The Changeling',
      metaDesc: "Build a Shapeshifter hero in HeroSculpt's free 3D superhero creator. Shape shift, adaptive form, perfect mimic — design your adaptable character.",
      description: 'Master of biological adaptation. Can change form to mimic any living being.',
      abilities: { primary: 'Shape Shift', secondary: 'Adaptive Form', ultimate: 'Perfect Mimic', passive: 'Regeneration' },
      examples: ['Mystique', 'Beast Boy', 'Martian Manhunter'],
      tips: [
        'Organic, flowing forms without rigid armor suggest limitless adaptability.',
        'Two contrasting colors on opposite sides hint at the ability to become something else.',
        'Avoid logos or symbols — a blank identity sells the "anyone" fantasy.'
      ],
    },
    es: {
      title: 'El Cambiante',
      metaDesc: 'Diseña un Shapeshifter en HeroSculpt, el creador de superhéroes 3D. Transformación, forma adaptativa y mímica perfecta. Construye tu personaje adaptable.',
      description: 'Maestro de la adaptación biológica. Puede cambiar de forma para imitar a cualquier ser vivo.',
      abilities: { primary: 'Metamorfosis', secondary: 'Forma Adaptativa', ultimate: 'Mímica Perfecta', passive: 'Regeneración' },
      examples: ['Mística', 'Chico Bestia', 'Martian Manhunter'],
      tips: [
        'Las formas orgánicas sin armadura rígida sugieren adaptabilidad ilimitada.',
        'Dos colores contrastantes en lados opuestos insinúan la capacidad de convertirse en otro.',
        'Evita logos o símbolos — una identidad en blanco vende la fantasía de "cualquiera".'
      ],
    },
  },
  {
    id: 'MENTALIST',
    slug: 'mentalist',
    name: 'Mentalist',
    icon: '🧠',
    theme: ['Psionics', 'Mind', 'Control'],
    stats: { power: 70, defense: 65, speed: 75, intelligence: 95, energy: 90 },
    en: {
      title: 'The Mind Reader',
      metaDesc: "Create a Mentalist psionic hero in HeroSculpt's free 3D character creator. Telepathy, mind blast, mass control — design your psychic-powered hero.",
      description: 'Master of psychic powers. Telepathy, mind control, and a psionic shield make this archetype lethal.',
      abilities: { primary: 'Mind Blast', secondary: 'Telepathy', ultimate: 'Mass Control', passive: 'Mental Shield' },
      examples: ['Jean Grey', 'Professor X', 'Emma Frost'],
      tips: [
        'Subtle form-fitting suits keep focus on the face and eyes — where mental power lives.',
        'Pink, violet, and silver suggest psychic wavelengths without being loud.',
        'A radiant headpiece is worth more than full armor for selling telepathy.'
      ],
    },
    es: {
      title: 'El Lector de Mentes',
      metaDesc: 'Crea un Mentalist psíquico en HeroSculpt, el creador 3D gratuito. Telepatía, explosión mental y control masivo. Diseña tu héroe psiónico.',
      description: 'Maestro de los poderes psíquicos. Telepatía, control mental y escudo psiónico lo hacen letal.',
      abilities: { primary: 'Explosión Mental', secondary: 'Telepatía', ultimate: 'Control Masivo', passive: 'Escudo Mental' },
      examples: ['Jean Grey', 'Profesor X', 'Emma Frost'],
      tips: [
        'Los trajes ajustados sutiles mantienen el foco en el rostro y ojos — donde vive el poder mental.',
        'El rosa, violeta y plateado sugieren longitudes de onda psíquicas sin ser estridentes.',
        'Una pieza de cabeza radiante vale más que armadura completa para transmitir telepatía.'
      ],
    },
  },
  {
    id: 'GADGETEER',
    slug: 'gadgeteer',
    name: 'Gadgeteer',
    icon: '🔧',
    theme: ['Technology', 'Innovation', 'Gadgets'],
    stats: { power: 75, defense: 80, speed: 70, intelligence: 95, energy: 85 },
    en: {
      title: 'The Inventor',
      metaDesc: "Design a Gadgeteer inventor hero in HeroSculpt's free 3D creator. Gadget mastery, tech shield, gadget storm — build your tech-utility character.",
      description: 'Master of gadgets and technology. Creates unique tools for every situation.',
      abilities: { primary: 'Gadget Mastery', secondary: 'Tech Shield', ultimate: 'Gadget Storm', passive: 'Technological Genius' },
      examples: ['Batman', 'Iron Man', 'Spider-Man'],
      tips: [
        'A utility belt loaded with pouches is the single most recognizable gadgeteer cue.',
        'Armored gloves or forearm pieces suggest hands-on tinkering.',
        'Muted colors (olive, tan, gray) focus attention on the accessories, not the suit.'
      ],
    },
    es: {
      title: 'El Artesano',
      metaDesc: 'Diseña un Gadgeteer inventor en HeroSculpt, el creador de personajes 3D. Maestría de gadgets, escudo tecnológico y tormenta de gadgets. Crea tu personaje.',
      description: 'Maestro de los gadgets y la tecnología. Crea herramientas únicas para cada situación.',
      abilities: { primary: 'Maestría de Gadgets', secondary: 'Escudo Tecnológico', ultimate: 'Tormenta de Gadgets', passive: 'Genio Tecnológico' },
      examples: ['Batman', 'Iron Man', 'Spider-Man'],
      tips: [
        'Un cinturón utilitario cargado de bolsillos es la señal más reconocible del gadgetero.',
        'Los guantes acorazados o piezas de antebrazo sugieren trabajo manual.',
        'Los colores apagados (oliva, tostado, gris) centran la atención en los accesorios.'
      ],
    },
  },
  {
    id: 'MONSTER',
    slug: 'monster',
    name: 'Monster',
    icon: '👹',
    theme: ['Brute Force', 'Rage', 'Power'],
    stats: { power: 95, defense: 85, speed: 70, intelligence: 60, energy: 80 },
    en: {
      title: 'The Beast',
      metaDesc: "Build a Monster brawler hero in HeroSculpt's free 3D superhero creator. Rage strike, primal roar, beast mode — design your primal powerhouse.",
      description: 'Raw power and primal fury. The most terrifying and physically devastating archetype in the game.',
      abilities: { primary: 'Rage Strike', secondary: 'Primal Roar', ultimate: 'Beast Mode', passive: 'Unstoppable Rage' },
      examples: ['Hulk', 'Wolverine', 'Beast'],
      tips: [
        'Oversized torso and hands are essential — scale sells the monstrous nature.',
        'Torn or battle-damaged edges on armor suggest the body breaking through.',
        'Desaturated reds, blacks, and sickly greens push the horror aesthetic.'
      ],
    },
    es: {
      title: 'La Bestia',
      metaDesc: 'Crea un Monster bravucón en HeroSculpt, el creador de superhéroes 3D gratuito. Golpe furioso, rugido primordial y modo bestia. Diseña tu coloso.',
      description: 'Poder bruto y furia primordial. El tipo más aterrador y físicamente devastador del juego.',
      abilities: { primary: 'Golpe Furioso', secondary: 'Rugido Primordial', ultimate: 'Modo Bestia', passive: 'Furia Imparable' },
      examples: ['Hulk', 'Wolverine', 'La Bestia'],
      tips: [
        'El torso y las manos de gran tamaño son esenciales — la escala vende la naturaleza monstruosa.',
        'Los bordes rasgados o dañados en la armadura sugieren que el cuerpo se abre paso.',
        'Los rojos desaturados, negros y verdes enfermizos impulsan la estética de terror.'
      ],
    },
  },
  {
    id: 'ELEMENTAL',
    slug: 'elemental',
    name: 'Elemental',
    icon: '🌪️',
    theme: ['Nature', 'Elements', 'Control'],
    stats: { power: 80, defense: 75, speed: 80, intelligence: 85, energy: 90 },
    en: {
      title: 'The Nature Master',
      metaDesc: "Create an Elemental hero in HeroSculpt's free 3D character creator. Fire, ice, or storm powers — elemental blast, nature's wrath — design your element master.",
      description: 'Master of natural elements. Controls fire, earth, air, or water with absolute precision.',
      abilities: { primary: 'Elemental Blast', secondary: 'Elemental Shield', ultimate: "Nature's Wrath", passive: 'Elemental Affinity' },
      examples: ['Storm', 'Iceman', 'Human Torch'],
      tips: [
        'Color-match the element: blues/whites for ice, reds/oranges for fire, greens for nature.',
        'Flowing capes or large shoulder pieces suggest the element radiating outward.',
        'Keep the core suit simple so element-themed accessories pop visually.'
      ],
    },
    es: {
      title: 'El Maestro Natural',
      metaDesc: 'Diseña un héroe Elemental en HeroSculpt, el creador 3D gratuito. Fuego, hielo o tormenta — explosión elemental e ira de la naturaleza. Construye tu héroe.',
      description: 'Maestro de los elementos naturales. Controla fuego, tierra, aire o agua con precisión absoluta.',
      abilities: { primary: 'Explosión Elemental', secondary: 'Escudo Elemental', ultimate: 'Ira de la Naturaleza', passive: 'Afinidad Elemental' },
      examples: ['Tormenta', 'Hombre de Hielo', 'Antorcha Humana'],
      tips: [
        'Elige colores que coincidan con el elemento: azules/blancos para hielo, rojos para fuego.',
        'Las capas amplias o piezas de hombro grandes sugieren el elemento irradiando hacia afuera.',
        'Mantén el traje base simple para que los accesorios temáticos destaquen.'
      ],
    },
  },
  {
    id: 'CONSTRUCT',
    slug: 'construct',
    name: 'Construct',
    icon: '🤖',
    theme: ['Artificial', 'Technology', 'Evolution'],
    stats: { power: 85, defense: 90, speed: 75, intelligence: 90, energy: 85 },
    en: {
      title: 'The Artificial',
      metaDesc: "Design a Construct artificial hero in HeroSculpt's free 3D creator. Tech strike, adaptive armor, system override — build your robot or AI superhero.",
      description: 'An artificial being with unique integrated abilities. Robot, android, or AI with technology built into the body.',
      abilities: { primary: 'Tech Strike', secondary: 'Adaptive Armor', ultimate: 'System Override', passive: 'Technological Evolution' },
      examples: ['Vision', 'Red Tornado', 'Ultron'],
      tips: [
        'Hard geometric seams and panel lines sell the artificial body better than organic curves.',
        'Silver, gunmetal, and white with a single accent color (red or blue) read as robotic.',
        'An exposed power core on the chest is the iconic construct cue — use the chest symbol slot.'
      ],
    },
    es: {
      title: 'El Ser Artificial',
      metaDesc: 'Crea un Construct artificial en HeroSculpt, el creador de superhéroes 3D. Golpe tecnológico, armadura adaptativa y anulación del sistema. Diseña tu robot.',
      description: 'Ser artificial con habilidades integradas únicas. Robot, androide o IA con tecnología incorporada en el cuerpo.',
      abilities: { primary: 'Golpe Tecnológico', secondary: 'Armadura Adaptativa', ultimate: 'Anulación del Sistema', passive: 'Evolución Tecnológica' },
      examples: ['Visión', 'Tornado Rojo', 'Ultrón'],
      tips: [
        'Las costuras geométricas y líneas de panel venden el cuerpo artificial mejor que las curvas orgánicas.',
        'Plata, acero y blanco con un color de acento único (rojo o azul) se leen como robótico.',
        'Un núcleo de poder expuesto en el pecho es la señal icónica del construct.'
      ],
    },
  },
  {
    id: 'BLASTER',
    slug: 'blaster',
    name: 'Blaster',
    icon: '🎯',
    theme: ['Ranged', 'Energy', 'Precision'],
    stats: { power: 75, defense: 65, speed: 80, intelligence: 80, energy: 90 },
    en: {
      title: 'The Ranged Fighter',
      metaDesc: "Build a Blaster ranged hero in HeroSculpt's free 3D superhero creator. Precision blast, energy shield, barrage storm — design your long-range fighter.",
      description: 'Master of long-range attacks. Absolute precision and devastating firepower from behind the front line.',
      abilities: { primary: 'Precision Blast', secondary: 'Energy Shield', ultimate: 'Barrage Storm', passive: 'Enhanced Accuracy' },
      examples: ['Havok', 'Firestar', 'Cyclops'],
      tips: [
        'Lighter form-fitting armor keeps mobility — Blasters need to reposition constantly.',
        'Visor or targeting-lens head accessories reinforce the ranged precision theme.',
        'Energy-accent colors (yellow, cyan, orange) on a neutral base suit look sleek.'
      ],
    },
    es: {
      title: 'El Combatiente a Distancia',
      metaDesc: 'Diseña un Blaster en HeroSculpt, el creador 3D gratuito. Explosión de precisión, escudo de energía y tormenta de disparos. Crea tu combatiente a distancia.',
      description: 'Maestro de los ataques a distancia. Precisión absoluta y potencia de fuego devastadora desde la retaguardia.',
      abilities: { primary: 'Explosión de Precisión', secondary: 'Escudo de Energía', ultimate: 'Tormenta de Disparos', passive: 'Precisión Mejorada' },
      examples: ['Havok', 'Firestar', 'Cíclope'],
      tips: [
        'La armadura ligera y ajustada mantiene la movilidad — los Blasters necesitan reposicionarse.',
        'Los accesorios de visera o lente de puntería refuerzan el tema de precisión a distancia.',
        'Colores de acento energético (amarillo, cian, naranja) en un traje neutro se ven elegantes.'
      ],
    },
  },
  {
    id: 'TRICKSTER',
    slug: 'trickster',
    name: 'Trickster',
    icon: '🎭',
    theme: ['Deception', 'Illusion', 'Chaos'],
    stats: { power: 70, defense: 65, speed: 85, intelligence: 90, energy: 80 },
    en: {
      title: 'The Deceiver',
      metaDesc: "Create a Trickster hero in HeroSculpt's free 3D character creator. Illusion mastery, trap setting, reality distortion — design your deceptive hero.",
      description: 'Master of illusions and deception. Unpredictable, chaotic, and lethal when you least expect it.',
      abilities: { primary: 'Illusion Mastery', secondary: 'Trap Setting', ultimate: 'Reality Distortion', passive: 'Master of Deception' },
      examples: ['Riddler', 'Loki', 'Mysterio'],
      tips: [
        'Asymmetric designs — one color on the left, another on the right — suggest duality.',
        'Jester patterns, diamonds, or masks are the visual shorthand for chaos and illusion.',
        'Purple and green are the classic trickster palette (Joker, Loki, Riddler).'
      ],
    },
    es: {
      title: 'El Embaucador',
      metaDesc: 'Crea un Trickster embaucador en HeroSculpt, el creador de personajes 3D. Maestría de ilusiones, trampas y distorsión de realidad. Diseña tu héroe caótico.',
      description: 'Maestro de las ilusiones y el engaño. Impredecible, caótico y letal cuando menos lo esperas.',
      abilities: { primary: 'Maestría de Ilusiones', secondary: 'Colocación de Trampas', ultimate: 'Distorsión de Realidad', passive: 'Maestro del Engaño' },
      examples: ['El Acertijo', 'Loki', 'Mysterio'],
      tips: [
        'Los diseños asimétricos — un color a la izquierda, otro a la derecha — sugieren dualidad.',
        'Los patrones de bufón, diamantes o máscaras son el lenguaje visual del caos y la ilusión.',
        'Púrpura y verde son la paleta clásica del embaucador (Joker, Loki, Riddler).'
      ],
    },
  },
  {
    id: 'CONTROLLER',
    slug: 'controller',
    name: 'Controller',
    icon: '🎮',
    theme: ['Control', 'Strategy', 'Domination'],
    stats: { power: 75, defense: 80, speed: 70, intelligence: 95, energy: 90 },
    en: {
      title: 'The Battlefield Master',
      metaDesc: "Design a Controller hero in HeroSculpt's free 3D creator. Field control, environmental manipulation, battlefield domination — build your strategy hero.",
      description: 'Master of battlefield control. Dominates the environment and dictates the terms of combat.',
      abilities: { primary: 'Field Control', secondary: 'Environmental Manipulation', ultimate: 'Battlefield Domination', passive: 'Strategic Mastery' },
      examples: ['Magneto', 'Iceman', 'Storm'],
      tips: [
        'Imposing silhouettes with wide shoulders communicate dominance over the battlefield.',
        'Dark blues, purples, and grays feel authoritative without being villainous.',
        'A distinctive helmet makes the controller instantly recognizable from a distance.'
      ],
    },
    es: {
      title: 'El Estratega',
      metaDesc: 'Diseña un Controller estratega en HeroSculpt, el creador 3D gratuito. Control de campo, manipulación ambiental y dominación. Construye tu maestro táctico.',
      description: 'Maestro del control del campo de batalla. Domina el entorno y dicta los términos del combate.',
      abilities: { primary: 'Control de Campo', secondary: 'Manipulación Ambiental', ultimate: 'Dominación del Campo', passive: 'Maestría Estratégica' },
      examples: ['Magneto', 'Hombre de Hielo', 'Tormenta'],
      tips: [
        'Las siluetas imponentes con hombros anchos comunican dominio sobre el campo de batalla.',
        'Los azules oscuros, púrpuras y grises se sienten autoritarios sin ser villanos.',
        'Un casco distintivo hace al Controller reconocible al instante desde lejos.'
      ],
    },
  },
  {
    id: 'SUMMONER',
    slug: 'summoner',
    name: 'Summoner',
    icon: '👻',
    theme: ['Summoning', 'Entities', 'Dark Magic'],
    stats: { power: 70, defense: 65, speed: 70, intelligence: 85, energy: 95 },
    en: {
      title: 'The Conjurer',
      metaDesc: "Build a Summoner hero in HeroSculpt's free 3D superhero creator. Entity summon, shadow control, legion of shadows — design your dark conjurer.",
      description: 'Master of summoning entities. Calls shadow creatures from the dark to fight for them.',
      abilities: { primary: 'Entity Summon', secondary: 'Shadow Control', ultimate: 'Legion of Shadows', passive: 'Dark Pact' },
      examples: ['Raven', 'Doctor Fate', 'Zatanna'],
      tips: [
        'Dark robes or cloaks with arcane trim separate the Summoner from combat archetypes.',
        'Black-purple-gold is the classic dark conjurer palette.',
        'Glowing eyes or a visible aura accessory implies the presence of bound entities.'
      ],
    },
    es: {
      title: 'El Conjurador',
      metaDesc: 'Crea un Summoner invocador en HeroSculpt, el creador de superhéroes 3D. Invocación de entidades, control de sombras y legión oscura. Diseña tu conjurador.',
      description: 'Maestro de la invocación de entidades. Llama criaturas de las sombras para que luchen por él.',
      abilities: { primary: 'Invocación de Entidades', secondary: 'Control de Sombras', ultimate: 'Legión de Sombras', passive: 'Pacto Oscuro' },
      examples: ['Raven', 'Doctor Fate', 'Zatanna'],
      tips: [
        'Las túnicas o capas oscuras con ribetes arcanos separan al Summoner de los arquetipos de combate.',
        'Negro-púrpura-dorado es la paleta clásica del conjurador oscuro.',
        'Ojos brillantes o un accesorio de aura visible implica la presencia de entidades ligadas.'
      ],
    },
  },
  {
    id: 'ANTIHERO',
    slug: 'antihero',
    name: 'Antihero',
    icon: '⚔️',
    theme: ['Violence', 'Pragmatism', 'Justice'],
    stats: { power: 85, defense: 80, speed: 80, intelligence: 85, energy: 75 },
    en: {
      title: 'The Dark Protector',
      metaDesc: "Create an Antihero in HeroSculpt's free 3D character creator. Brutal strike, tactical defense, unleashed fury — design your dark protector.",
      description: 'Violent but effective protector. Uses questionable methods to achieve real results.',
      abilities: { primary: 'Brutal Strike', secondary: 'Tactical Defense', ultimate: 'Unleashed Fury', passive: 'Combat Experience' },
      examples: ['Punisher', 'Wolverine', 'Deadpool'],
      tips: [
        'Black tactical gear with minimal color signals the moral ambiguity of the archetype.',
        'Visible weapons, scars, or battle damage tell the story of someone who gets results.',
        'Avoid capes and symbols — antiheroes operate outside the heroic code they reject.'
      ],
    },
    es: {
      title: 'El Protector Oscuro',
      metaDesc: 'Diseña un Antihero en HeroSculpt, el creador 3D gratuito. Golpe brutal, defensa táctica y furia desatada. Construye tu protector de las sombras.',
      description: 'Protector violento pero efectivo. Usa métodos cuestionables para lograr resultados reales.',
      abilities: { primary: 'Golpe Brutal', secondary: 'Defensa Táctica', ultimate: 'Furia Desatada', passive: 'Experiencia de Combate' },
      examples: ['El Castigador', 'Wolverine', 'Deadpool'],
      tips: [
        'El equipo táctico negro con color mínimo señala la ambigüedad moral del arquetipo.',
        'Las armas visibles, cicatrices o daños de batalla cuentan la historia de alguien que obtiene resultados.',
        'Evita capas y símbolos — los antihéroes operan fuera del código heroico que rechazan.'
      ],
    },
  },
];

export const I18N = {
  en: {
    statsLabel: 'Combat Stats',
    abilitiesLabel: 'Abilities',
    primaryLabel: 'Primary',
    secondaryLabel: 'Secondary',
    ultimateLabel: 'Ultimate',
    passiveLabel: 'Passive',
    examplesLabel: 'Famous Heroes',
    tipsLabel: 'Design Tips',
    otherLabel: 'Explore Other Archetypes',
    ctaText: (name) => `Build your ${name} →`,
    ctaSub: 'Free 3D character creator · No account required',
    footerText: 'Build your hero. Print it. Play it.',
    tag: 'ARCHETYPE',
    altLangText: 'Ver en Español',
    statLabels: { power: 'Power', defense: 'Defense', speed: 'Speed', intelligence: 'Intel', energy: 'Energy' },
  },
  es: {
    statsLabel: 'Estadísticas',
    abilitiesLabel: 'Habilidades',
    primaryLabel: 'Principal',
    secondaryLabel: 'Secundaria',
    ultimateLabel: 'Definitiva',
    passiveLabel: 'Pasiva',
    examplesLabel: 'Héroes Famosos',
    tipsLabel: 'Consejos de Diseño',
    otherLabel: 'Explorar Otros Arquetipos',
    ctaText: (name) => `Crea tu ${name} →`,
    ctaSub: 'Creador 3D gratuito · Sin cuenta requerida',
    footerText: 'Crea tu héroe. Imprímelo. Juégalo.',
    tag: 'ARQUETIPO',
    altLangText: 'View in English',
    statLabels: { power: 'Fuerza', defense: 'Defensa', speed: 'Velocidad', intelligence: 'Intel', energy: 'Energía' },
  },
};

// --- MAGAZZINO RISORSE GRAFICHE (EMOJI EDITION) ---
// Usiamo le Emoji native: non pesano, non spariscono, sono sempre nitide.

export const DEFAULT_ASSETS = {
    // 1. PERSONAGGI (Mascotte & Animali)
    mascots: [
        { id: 'zebra', label: 'La Zebretta', src: '', content: '🦓' }, // ECCOLA!
        { id: 'lion', label: 'Leone', src: '', content: '🦁' },
        { id: 'cat', label: 'Gatto', src: '', content: '🐈' },
        { id: 'dog', label: 'Cane', src: '', content: '🐕' },
        { id: 'santa', label: 'Babbo Natale', src: '', content: '🎅' },
        { id: 'mrs_claus', label: 'Mamma Natale', src: '', content: '🤶' },
        { id: 'elf', label: 'Elfo', src: '', content: '🧝' },
        { id: 'superhero', label: 'Eroe', src: '', content: '🦸' },
        { id: 'detective', label: 'Detective', src: '', content: '🕵️' },
        { id: 'police', label: 'Polizia', src: '', content: '👮' },
        { id: 'doctor', label: 'Dottore', src: '', content: '👨‍⚕️' },
        { id: 'graduate', label: 'Laureato', src: '', content: '👨‍🎓' },
        { id: 'bride', label: 'Sposa', src: '', content: '👰' },
        { id: 'groom', label: 'Sposo', src: '', content: '🤵' },
        { id: 'baby', label: 'Neonato', src: '', content: '👶' },
        { id: 'grandma', label: 'Nonna', src: '', content: '👵' },
        { id: 'grandpa', label: 'Nonno', src: '', content: '👴' },
        { id: 'family', label: 'Famiglia', src: '', content: '👨‍👩‍👧‍👦' },
        { id: 'unicorn', label: 'Unicorno', src: '', content: '🦄' },
        { id: 'dino', label: 'Dino', src: '', content: '🦖' }
    ],

    // 2. EMOZIONI (Stati d'animo)
    emotions: [
        { id: 'love', label: 'Amore', content: '🥰' },
        { id: 'laugh', label: 'Risata', content: '😂' },
        { id: 'star_eyes', label: 'Wow', content: '🤩' },
        { id: 'cool', label: 'Cool', content: '😎' },
        { id: 'party', label: 'Festa', content: '🥳' },
        { id: 'cry_joy', label: 'Gioia', content: '🥹' },
        { id: 'cry', label: 'Pianto', content: '😭' },
        { id: 'angry', label: 'Rabbia', content: '😡' },
        { id: 'shock', label: 'Shock', content: '😱' },
        { id: 'think', label: 'Dubbio', content: '🤔' },
        { id: 'shh', label: 'Segreto', content: '🤫' },
        { id: 'sick', label: 'Malato', content: '🤒' },
        { id: 'angel', label: 'Angelo', content: '😇' },
        { id: 'devil', label: 'Diavolo', content: '😈' },
        { id: 'clown', label: 'Pagliaccio', content: '🤡' },
        { id: 'poop', label: 'Ops!', content: '💩' },
        { id: 'ghost', label: 'Fantasma', content: '👻' },
        { id: 'alien', label: 'Alieno', content: '👽' },
        { id: 'robot', label: 'Robot', content: '🤖' }
    ],

    // 3. FUMETTI (SVG Rimasti per la forma)
    bubbles: [
        { id: 'speech_classic', label: 'Classico', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 Q10,10 100,10 T190,75 Q190,140 100,140 L60,140 L30,150 L40,130 Q10,130 10,75" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'speech_round', label: 'Rotondo', svg: `<svg viewBox="0 0 200 150"><ellipse cx="100" cy="70" rx="90" ry="60" fill="white" stroke="black" stroke-width="3"/><path d="M80,125 L60,150 L100,128" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'thought', label: 'Pensiero', svg: `<svg viewBox="0 0 200 150"><path d="M20,75 Q20,10 100,10 T180,75 Q180,130 100,130 L60,130 L40,150 L50,120 Q20,120 20,75" fill="white" stroke="black" stroke-width="3" stroke-dasharray="5,5"/><circle cx="30" cy="145" r="5" fill="black"/><circle cx="40" cy="135" r="8" fill="black"/></svg>` },
        { id: 'shout', label: 'Urlo', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 L30,40 L10,10 L60,30 L100,5 L140,30 L190,10 L170,40 L190,75 L170,110 L190,140 L140,120 L100,145 L60,120 L10,140 L30,110 Z" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'box_vintage', label: 'Pergamena', svg: `<svg viewBox="0 0 200 100"><rect x="5" y="5" width="190" height="90" fill="#fffbe6" stroke="#8b4513" stroke-width="4"/><line x1="15" y1="15" x2="185" y2="15" stroke="#8b4513" stroke-width="1"/><line x1="15" y1="85" x2="185" y2="85" stroke="#8b4513" stroke-width="1"/></svg>` },
        { id: 'arrow_left', label: 'Freccia SX', svg: `<svg viewBox="0 0 200 100"><path d="M180,40 L60,40 L60,20 L10,50 L60,80 L60,60 L180,60 Z" fill="black"/></svg>` },
        { id: 'arrow_right', label: 'Freccia DX', svg: `<svg viewBox="0 0 200 100"><path d="M20,40 L140,40 L140,20 L190,50 L140,80 L140,60 L20,60 Z" fill="black"/></svg>` }
    ],

    // 4. OGGETTI (Stickers)
    stickers: [
        // Simboli Utili
        { id: 'bolt', label: 'Fulmine', content: '⚡' },
        { id: 'sparkles', label: 'Scintille', content: '✨' },
        { id: 'fire', label: 'Fuoco', content: '🔥' },
        { id: 'star', label: 'Stella', content: '⭐' },
        { id: 'heart', label: 'Cuore', content: '❤️' },
        { id: 'check', label: 'Ok', content: '✅' },
        { id: 'cross', label: 'No', content: '❌' },
        { id: 'warning', label: 'Attenzione', content: '⚠️' },
        { id: '100', label: '100%', content: '💯' },
        
        // Festa
        { id: 'cake', label: 'Torta', content: '🎂' },
        { id: 'champagne', label: 'Cin Cin', content: '🥂' },
        { id: 'balloon', label: 'Palloncino', content: '🎈' },
        { id: 'party_popper', label: 'Coriandoli', content: '🎉' },
        { id: 'gift', label: 'Regalo', content: '🎁' },
        { id: 'candle', label: 'Candela', content: '🕯️' },
        
        // Eventi
        { id: 'grad_cap', label: 'Laurea', content: '🎓' },
        { id: 'rings', label: 'Fedi', content: '💍' },
        { id: 'dove', label: 'Pace', content: '🕊️' },
        { id: 'cross', label: 'Fede', content: '✝️' },
        { id: 'xmas_tree', label: 'Albero', content: '🎄' },
        { id: 'pumpkin', label: 'Zucca', content: '🎃' },
        { id: 'football', label: 'Calcio', content: '⚽' },
        { id: 'trophy', label: 'Coppa', content: '🏆' },
        { id: 'medal', label: 'Medaglia', content: '🥇' },
        
        // Natura & Varie
        { id: 'rose', label: 'Rosa', content: '🌹' },
        { id: 'sun', label: 'Sole', content: '☀️' },
        { id: 'moon', label: 'Luna', content: '🌙' },
        { id: 'rainbow', label: 'Arcobaleno', content: '🌈' },
        { id: 'camera', label: 'Foto', content: '📸' },
        { id: 'music', label: 'Musica', content: '🎵' },
        { id: 'money', label: 'Soldi', content: '💰' },
        { id: 'plane', label: 'Viaggio', content: '✈️' }
    ]
};

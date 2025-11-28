// --- MAGAZZINO RISORSE GRAFICHE ---
// Qui puoi aggiungere tutti i link che vuoi senza appesantire il codice principale.

export const DEFAULT_ASSETS = {
    // 1. PERSONAGGI (Vintage & Eventi)
    mascots: [
        { id: 'strillone', label: 'Strillone', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995655.png' },
        { id: 'gentleman', label: 'Gentiluomo', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png' },
        { id: 'lady_vintage', label: 'Dama', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995539.png' },
        { id: 'grandpa', label: 'Nonno', src: 'https://cdn-icons-png.flaticon.com/512/3048/3048163.png' },
        { id: 'grandma', label: 'Nonna', src: 'https://cdn-icons-png.flaticon.com/512/3048/3048189.png' },
        { id: 'santa', label: 'Babbo Natale', src: 'https://cdn-icons-png.flaticon.com/512/744/744546.png' },
        { id: 'befana', label: 'Befana/Strega', src: 'https://cdn-icons-png.flaticon.com/512/2316/2316794.png' },
        { id: 'graduate_m', label: 'Laureato', src: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png' },
        { id: 'graduate_f', label: 'Laureata', src: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
        { id: 'bride', label: 'Sposa', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405546.png' },
        { id: 'groom', label: 'Sposo', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405451.png' },
        { id: 'baby_boy', label: 'Bimbo', src: 'https://cdn-icons-png.flaticon.com/512/2503/2503898.png' },
        { id: 'baby_girl', label: 'Bimba', src: 'https://cdn-icons-png.flaticon.com/512/2503/2503906.png' },
        { id: 'cat', label: 'Gatto', src: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
        { id: 'dog', label: 'Cane', src: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' }
    ],

    // 2. EMOZIONI & SIMBOLI (Emoji + Icone)
    emotions: [
        // Simboli Eventi
        { id: 'grad_cap', label: 'Tocco', content: '🎓' },
        { id: 'scroll', label: 'Pergamena', content: '📜' },
        { id: 'rings', label: 'Fedi', content: '💍' },
        { id: 'dove', label: 'Colomba', content: '🕊️' },
        { id: 'cross', label: 'Fede', content: '✝️' },
        { id: 'xmas_tree', label: 'Albero', content: '🎄' },
        { id: 'pumpkin', label: 'Zucca', content: '🎃' },
        { id: 'ghost', label: 'Fantasma', content: '👻' },
        { id: 'baby_pacifier', label: 'Ciuccio', content: '👶' },
        { id: 'stork', label: 'Cicogna', content: '🦢' },
        // Sentimenti
        { id: 'heart_red', label: 'Cuore', content: '❤️' },
        { id: 'heart_sparkle', label: 'Love', content: '💖' },
        { id: 'star', label: 'Stella', content: '⭐' },
        { id: 'sparkles', label: 'Magia', content: '✨' },
        { id: 'fire', label: 'Fuoco', content: '🔥' },
        { id: 'laugh', label: 'Risata', content: '😂' },
        { id: 'love_face', label: 'Innamorato', content: '🥰' },
        { id: 'party_face', label: 'Festa', content: '🥳' },
        { id: 'cool', label: 'Cool', content: '😎' },
        { id: 'cry', label: 'Commosso', content: '🥹' },
        { id: 'shock', label: 'Shock', content: '😱' },
        { id: 'thinking', label: 'Dubbio', content: '🤔' },
        { id: 'clap', label: 'Bravo', content: '👏' },
        { id: 'cheers', label: 'Cin Cin', content: '🥂' }
    ],

    // 3. FUMETTI (SVG Scalabili)
    bubbles: [
        { id: 'speech_classic', label: 'Classico', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 Q10,10 100,10 T190,75 Q190,140 100,140 L60,140 L30,150 L40,130 Q10,130 10,75" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'speech_round', label: 'Rotondo', svg: `<svg viewBox="0 0 200 150"><ellipse cx="100" cy="70" rx="90" ry="60" fill="white" stroke="black" stroke-width="3"/><path d="M80,125 L60,150 L100,128" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'thought', label: 'Pensiero', svg: `<svg viewBox="0 0 200 150"><path d="M20,75 Q20,10 100,10 T180,75 Q180,130 100,130 L60,130 L40,150 L50,120 Q20,120 20,75" fill="white" stroke="black" stroke-width="3" stroke-dasharray="5,5"/><circle cx="30" cy="145" r="5" fill="black"/><circle cx="40" cy="135" r="8" fill="black"/></svg>` },
        { id: 'shout', label: 'Urlo', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 L30,40 L10,10 L60,30 L100,5 L140,30 L190,10 L170,40 L190,75 L170,110 L190,140 L140,120 L100,145 L60,120 L10,140 L30,110 Z" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'box_vintage', label: 'Pergamena', svg: `<svg viewBox="0 0 200 100"><rect x="5" y="5" width="190" height="90" fill="#fffbe6" stroke="#8b4513" stroke-width="4"/><line x1="15" y1="15" x2="185" y2="15" stroke="#8b4513" stroke-width="1"/><line x1="15" y1="85" x2="185" y2="85" stroke="#8b4513" stroke-width="1"/></svg>` },
        { id: 'box_modern', label: 'Didascalia', svg: `<svg viewBox="0 0 200 80"><rect x="0" y="0" width="200" height="80" fill="black" opacity="0.8"/><rect x="2" y="2" width="196" height="76" fill="white" stroke="black" stroke-width="2"/></svg>` },
        { id: 'arrow_left', label: 'Freccia SX', svg: `<svg viewBox="0 0 200 100"><path d="M180,40 L60,40 L60,20 L10,50 L60,80 L60,60 L180,60 Z" fill="black"/></svg>` },
        { id: 'arrow_right', label: 'Freccia DX', svg: `<svg viewBox="0 0 200 100"><path d="M20,40 L140,40 L140,20 L190,50 L140,80 L140,60 L20,60 Z" fill="black"/></svg>` }
    ],

    // 4. OGGETTI & STICKERS
    stickers: [
        // Festa
        { id: 'cake', label: 'Torta', content: '🎂' },
        { id: 'champagne', label: 'Spumante', content: '🍾' },
        { id: 'balloon', label: 'Palloncino', content: '🎈' },
        { id: 'party_popper', label: 'Coriandoli', content: '🎉' },
        { id: 'gift', label: 'Regalo', content: '🎁' },
        { id: 'candle', label: 'Candela', content: '🕯️' },
        // Vintage & Accessori
        { id: 'wreath', label: 'Alloro', content: '🌿' },
        { id: 'rose', label: 'Rosa', content: '🌹' },
        { id: 'camera', label: 'Camera', content: '📷' },
        { id: 'film', label: 'Pellicola', content: '🎞️' },
        { id: 'medal', label: 'Medaglia', content: '🥇' },
        { id: 'crown', label: 'Corona', content: '👑' },
        { id: 'top_secret', label: 'Top Secret', src: 'https://cdn-icons-png.flaticon.com/512/9373/9373844.png' },
        { id: 'approved', label: 'Approvato', src: 'https://cdn-icons-png.flaticon.com/512/5229/5229357.png' },
        { id: 'new', label: 'Novità', src: 'https://cdn-icons-png.flaticon.com/512/10485/10485765.png' },
        { id: 'sale', label: 'Offerta', src: 'https://cdn-icons-png.flaticon.com/512/3659/3659885.png' },
        { id: 'warning', label: 'Attenzione', src: 'https://cdn-icons-png.flaticon.com/512/564/564619.png' }
    ]
};

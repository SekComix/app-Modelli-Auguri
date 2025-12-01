// --- MAGAZZINO RISORSE GRAFICHE (MEGA PACK) ---

export const DEFAULT_ASSETS = {
    // 1. PERSONAGGI (Mascotte)
    mascots: [
        // ZEBRA (Testa e Corpo)
        { id: 'zebra_head', label: 'Zebretta', src: 'https://cdn-icons-png.flaticon.com/512/616/616558.png' },
        { id: 'zebra_run', label: 'Zebra Corre', src: 'https://cdn-icons-png.flaticon.com/512/616/616459.png' },
        
        // SPORT
        { id: 'soccer_ball', label: 'Pallone', src: 'https://cdn-icons-png.flaticon.com/512/53/53283.png' },
        { id: 'cup', label: 'Coppa', src: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png' },

        // CLASSICI
        { id: 'strillone', label: 'Strillone', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995655.png' },
        { id: 'gentleman', label: 'Gentiluomo', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png' },
        { id: 'lady', label: 'Dama', src: 'https://cdn-icons-png.flaticon.com/512/1995/1995539.png' },
        
        // FESTIVITÀ
        { id: 'santa', label: 'Babbo Natale', src: 'https://cdn-icons-png.flaticon.com/512/744/744546.png' },
        { id: 'elf', label: 'Elfo', src: 'https://cdn-icons-png.flaticon.com/512/614/614145.png' },
        { id: 'befana', label: 'Befana', src: 'https://cdn-icons-png.flaticon.com/512/2316/2316794.png' },
        
        // EVENTI VITA
        { id: 'graduate_m', label: 'Laureato', src: 'https://cdn-icons-png.flaticon.com/512/3135/3135810.png' },
        { id: 'graduate_f', label: 'Laureata', src: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
        { id: 'bride', label: 'Sposa', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405546.png' },
        { id: 'groom', label: 'Sposo', src: 'https://cdn-icons-png.flaticon.com/512/2405/2405451.png' },
        { id: 'baby_boy', label: 'Bimbo', src: 'https://cdn-icons-png.flaticon.com/512/2503/2503898.png' },
        { id: 'baby_girl', label: 'Bimba', src: 'https://cdn-icons-png.flaticon.com/512/2503/2503906.png' },
        
        // ANIMALI
        { id: 'cat', label: 'Gatto', src: 'https://cdn-icons-png.flaticon.com/512/616/616430.png' },
        { id: 'dog', label: 'Cane', src: 'https://cdn-icons-png.flaticon.com/512/616/616554.png' },
        { id: 'lion', label: 'Leone', src: 'https://cdn-icons-png.flaticon.com/512/616/616412.png' }
    ],

    // 2. EMOZIONI & SIMBOLI
    emotions: [
        // Simboli Eventi
        { id: 'grad_cap', label: 'Tocco', content: '🎓' },
        { id: 'scroll', label: 'Pergamena', content: '📜' },
        { id: 'rings', label: 'Fedi', content: '💍' },
        { id: 'dove', label: 'Colomba', content: '🕊️' },
        { id: 'cross', label: 'Fede', content: '✝️' },
        { id: 'xmas_tree', label: 'Albero', content: '🎄' },
        { id: 'santa_face', label: 'Babbo', content: '🎅' },
        { id: 'gift', label: 'Regalo', content: '🎁' },
        { id: 'pumpkin', label: 'Zucca', content: '🎃' },
        { id: 'ghost', label: 'Fantasma', content: '👻' },
        { id: 'baby_pacifier', label: 'Ciuccio', content: '👶' },
        { id: 'stork', label: 'Cicogna', content: '🦢' },
        { id: 'cake', label: 'Torta', content: '🎂' },
        { id: 'cheers', label: 'Cin Cin', content: '🥂' },
        
        // Emozioni
        { id: 'heart_red', label: 'Cuore', content: '❤️' },
        { id: 'heart_blue', label: 'Cuore Blu', content: '💙' }, // Per la squadra?
        { id: 'black_white', label: 'B&N', content: '🏁' },
        { id: 'star', label: 'Stella', content: '⭐' },
        { id: 'sparkles', label: 'Magia', content: '✨' },
        { id: 'fire', label: 'Fuoco', content: '🔥' },
        { id: 'laugh', label: 'Risata', content: '😂' },
        { id: 'love_face', label: 'Amore', content: '🥰' },
        { id: 'party_face', label: 'Festa', content: '🥳' },
        { id: 'cool', label: 'Cool', content: '😎' },
        { id: 'cry', label: 'Commosso', content: '🥹' },
        { id: 'muscle', label: 'Forza', content: '💪' },
        { id: 'pray', label: 'Preghiera', content: '🙏' },
        
        // Simboli Utili
        { id: 'check', label: 'Ok', content: '✅' },
        { id: 'warning', label: 'Attenzione', content: '⚠️' },
        { id: 'pin', label: 'Puntina', content: '📍' },
        { id: 'camera', label: 'Foto', content: '📸' },
        { id: 'music', label: 'Musica', content: '🎵' },
        { id: 'pencil', label: 'Matita', content: '✏️' },
        { id: '100', label: 'Top', content: '💯' }
    ],

    // 3. FUMETTI
    bubbles: [
        { id: 'speech_classic', label: 'Classico', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 Q10,10 100,10 T190,75 Q190,140 100,140 L60,140 L30,150 L40,130 Q10,130 10,75" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'speech_round', label: 'Rotondo', svg: `<svg viewBox="0 0 200 150"><ellipse cx="100" cy="70" rx="90" ry="60" fill="white" stroke="black" stroke-width="3"/><path d="M80,125 L60,150 L100,128" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'thought', label: 'Pensiero', svg: `<svg viewBox="0 0 200 150"><path d="M20,75 Q20,10 100,10 T180,75 Q180,130 100,130 L60,130 L40,150 L50,120 Q20,120 20,75" fill="white" stroke="black" stroke-width="3" stroke-dasharray="5,5"/><circle cx="30" cy="145" r="5" fill="black"/><circle cx="40" cy="135" r="8" fill="black"/></svg>` },
        { id: 'shout', label: 'Urlo', svg: `<svg viewBox="0 0 200 150"><path d="M10,75 L30,40 L10,10 L60,30 L100,5 L140,30 L190,10 L170,40 L190,75 L170,110 L190,140 L140,120 L100,145 L60,120 L10,140 L30,110 Z" fill="white" stroke="black" stroke-width="3"/></svg>` },
        { id: 'box_vintage', label: 'Pergamena', svg: `<svg viewBox="0 0 200 100"><rect x="5" y="5" width="190" height="90" fill="#fffbe6" stroke="#8b4513" stroke-width="4"/><line x1="15" y1="15" x2="185" y2="15" stroke="#8b4513" stroke-width="1"/><line x1="15" y1="85" x2="185" y2="85" stroke="#8b4513" stroke-width="1"/></svg>` }
    ],

    // 4. OGGETTI
    stickers: [
        { id: 'cake', label: 'Torta', content: '🎂' },
        { id: 'champagne', label: 'Spumante', content: '🍾' },
        { id: 'balloon', label: 'Palloncino', content: '🎈' },
        { id: 'party_popper', label: 'Coriandoli', content: '🎉' },
        { id: 'gift', label: 'Regalo', content: '🎁' },
        { id: 'candle', label: 'Candela', content: '🕯️' },
        { id: 'wreath', label: 'Alloro', content: '🌿' },
        { id: 'rose', label: 'Rosa', content: '🌹' },
        { id: 'camera', label: 'Camera', content: '📷' },
        { id: 'film', label: 'Pellicola', content: '🎞️' },
        { id: 'medal', label: 'Medaglia', content: '🥇' },
        { id: 'crown', label: 'Corona', content: '👑' },
        { id: 'top_secret', label: 'Top Secret', src: 'https://cdn-icons-png.flaticon.com/512/9373/9373844.png' },
        { id: 'approved', label: 'Approvato', src: 'https://cdn-icons-png.flaticon.com/512/5229/5229357.png' }
    ]
};

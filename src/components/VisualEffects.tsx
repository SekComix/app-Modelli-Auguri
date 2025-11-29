import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../types';

interface VisualEffectsProps {
  theme: ThemeConfig;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ theme }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  // Mappatura Eventi -> Effetti
  // Se l'evento è Natale -> neve. Se Compleanno -> coriandoli, ecc.
  // Usiamo theme.id o theme.decoration
  
  useEffect(() => {
    const items: React.ReactNode[] = [];
    const count = 50; // Numero di particelle

    // DETERMINA IL TIPO DI EFFETTO
    let type = 'none';
    if (theme.id === 'christmas' || theme.decoration === 'snow') type = 'snow';
    else if (theme.id === 'birthday' || theme.id === 'graduation' || theme.id === 'party' || theme.decoration === 'confetti') type = 'confetti';
    else if (theme.id === 'wedding' || theme.id === 'love' || theme.decoration === 'hearts') type = 'hearts';
    else if (theme.id === 'halloween' || theme.decoration === 'spooky') type = 'spooky';

    if (type === 'none') {
        setParticles([]);
        return;
    }

    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100; // Posizione orizzontale %
      const delay = Math.random() * 5; // Ritardo casuale
      const duration = Math.random() * 5 + 5; // Durata caduta (5-10s)
      const size = Math.random() * 1.5 + 0.5; // Grandezza

      let content: React.ReactNode = '';
      let className = 'fx-item';
      let style: React.CSSProperties = {
          left: `${left}%`,
          animationDelay: `-${delay}s`, // Parte già in movimento
          animationDuration: `${duration}s`,
          fontSize: `${size}rem`
      };

      if (type === 'snow') {
          content = '❄';
          className += ' fx-snow';
      } else if (type === 'hearts') {
          content = '❤️'; // O 🤍 per matrimonio
          className += ' fx-heart';
      } else if (type === 'spooky') {
          content = ['🦇', '🕸️', '🎃'][Math.floor(Math.random() * 3)];
          className += ' fx-heart'; // Riutilizza animazione caduta
      } else if (type === 'confetti') {
          className += ' fx-confetti';
          // Colori casuali per coriandoli
          style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'][Math.floor(Math.random() * 6)];
          // Forma casuale (tonda o quadrata)
          style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      }

      items.push(
        <div key={i} className={className} style={style}>
          {content}
        </div>
      );
    }

    setParticles(items);
  }, [theme.id, theme.decoration]);

  if (particles.length === 0) return null;

  return (
    <div className="fx-container">
      {particles}
    </div>
  );
};

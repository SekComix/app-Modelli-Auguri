import React from 'react';
import { ThemeConfig } from '../types';

interface VisualEffectsProps {
  theme: ThemeConfig;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ theme }) => {
  if (!theme.decoration || theme.decoration === 'none') return null;

  const isSnow = theme.decoration === 'snow';
  const isConfetti = theme.decoration === 'confetti';
  const isHearts = theme.decoration === 'hearts';
  const isSpooky = theme.decoration === 'spooky';

  // Creiamo un array fisso di elementi
  const items = Array.from({ length: isSnow ? 50 : 30 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999] print:hidden">
      {items.map((_, i) => {
        // Calcoli casuali per posizione e velocità
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 5 + 5; // tra 5 e 10 secondi
        const size = Math.random() * 1 + 0.5;

        return (
          <div
            key={i}
            className={isSnow ? "snowflake" : isConfetti ? "confetti" : "floater"}
            style={{
              left: `${left}%`,
              animationDelay: `-${delay}s`, // Inizia già a metà strada
              animationDuration: `${duration}s`,
              fontSize: isSnow ? `${size}em` : undefined,
              // Per coriandoli: colori casuali
              backgroundColor: isConfetti ? ['#f00','#0f0','#00f','#ff0'][Math.floor(Math.random()*4)] : undefined,
              // Per cuori/spooky: contenuto
              content: isHearts ? '"❤️"' : isSpooky ? '"🕸️"' : undefined
            }}
          >
            {isSnow && "❄"}
            {isHearts && "❤️"}
            {isSpooky && "🕸️"}
          </div>
        );
      })}
    </div>
  );
};

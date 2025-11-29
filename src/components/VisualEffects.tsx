import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../types';

interface VisualEffectsProps {
  theme: ThemeConfig;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ theme }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Reset particelle al cambio tema
    setParticles([]);

    if (theme.decoration === 'snow') {
      // Genera 30 fiocchi di neve
      const snow = Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`snow-${i}`}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s, ${Math.random() * 3}s`, // Ritardo casuale per realismo
            opacity: Math.random(),
            fontSize: `${Math.random() * 1.5 + 0.5}em`
          }}
        >
          ❄
        </div>
      ));
      setParticles(snow);
    } else if (theme.decoration === 'confetti') {
      // Genera 40 coriandoli colorati
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const confetti = Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 4}s`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 5 + 5}px`
          }}
        />
      ));
      setParticles(confetti);
    }
  }, [theme.id, theme.decoration]);

  // Non mostrare nulla in stampa (print:hidden è gestito dal CSS globale ma per sicurezza)
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 print:hidden">
      {particles}
    </div>
  );
};

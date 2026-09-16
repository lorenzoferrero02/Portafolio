import { useState } from 'react';
import { writeups, type WriteupMeta } from './loader';
import { WriteupDetail } from './WriteupDetail';
import './writeups.css';

interface WriteupsProps {
  onBack: () => void;
}

export function Writeups({ onBack }: WriteupsProps) {
  const [selected, setSelected] = useState<WriteupMeta | null>(null);

  if (selected) {
    return (
      <WriteupDetail
        writeup={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="writeups-container">
      <button className="back-btn" onClick={onBack}>
        ← Home
      </button>

      <div className="writeups-content">
        <header className="writeups-header">
          <h1>Writeups</h1>
          <p>HTB, CTF &amp; security notes</p>
        </header>

        {writeups.length === 0 ? (
          <p className="writeups-empty">No writeups yet.</p>
        ) : (
          <div className="writeups-grid">
            {writeups.map((w) => (
              <button
                key={w.slug}
                className="writeup-card"
                onClick={() => setSelected(w)}
              >
                <div className="writeup-card-top">
                  {w.platform && (
                    <span className="writeup-card-platform">{w.platform}</span>
                  )}
                  {w.difficulty && (
                    <span className="writeup-card-diff">{w.difficulty}</span>
                  )}
                </div>
                <h2>{w.title}</h2>
                {w.description && <p>{w.description}</p>}
                <div className="writeup-card-footer">
                  <span>{w.date}</span>
                  <span className="writeup-card-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
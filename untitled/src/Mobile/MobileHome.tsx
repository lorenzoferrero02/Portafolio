import React from 'react';
import { MobileProjectsSection } from './MobileProjectSection';

export const MobileHome: React.FC = () => {
  return (
    <main className="mobile-home">
      <header className="mobile-header">
        <h1>Lorenzo Ferrero</h1>
        <p>Cybersecurity & Mobile Dev</p>
      </header>
      <section className="mobile-section">
        <h2>About</h2>
        <p>Master's student in Cyber Security at Politecnico di Torino.</p>
      </section>
      {/* Aggiungi qui altri componenti ultra-light */}
      <MobileProjectsSection></MobileProjectsSection>
    </main>
  );
};
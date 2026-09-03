import React from 'react';
import { projects } from '../projects';
import { MobileProjectCard } from './MobileProjectCard';

export const MobileProjectsSection: React.FC = () => {
  return (
    <section className="mobile-projects-section">
      <h2>Progetti</h2>
      <div className="projects-scroll-container">
        {projects.map((project) => (
          <MobileProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};
import React, { useState } from 'react';
import { Project } from '../projects';

interface Props {
  project: Project;
}

export const MobileProjectCard: React.FC<Props> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`mobile-project-card ${isOpen ? 'open' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="project-summary">
        {project.logoUrl ? (
          <img src={project.logoUrl} alt={project.title} className="project-logo-img" />
        ) : (
          <div className="project-logo-fallback">⚡</div>
        )}
        <div className="project-titles">
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
        <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="project-details">
          <p className="project-desc">{project.description}</p>
          
          <div className="tech-tags">
            {project.technologies.map((tech, index) => (
              <span key={index} className="tag">
                <img src={tech.logo} alt={tech.name} className="tech-logo-mini" />
                {tech.name}
              </span>
            ))}
          </div>

          {project.githubRepo && (
            <a 
              href={project.githubRepo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="github-link"
              onClick={(e) => e.stopPropagation()} // Evita di chiudere la card al click sul link
            >
              GitHub Repo →
            </a>
          )}
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../projects';

interface Props {
  project: Project;
}

export const MobileProjectCard: React.FC<Props> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`mobile-project-card ${isOpen ? 'open' : ''}`}
      onClick={() => setIsOpen((v) => !v)}
    >
      <div className="project-summary">
        {project.logoUrl ? (
          <img
            src={project.logoUrl}
            alt={project.title}
            className="project-logo-img"
            loading="lazy"
          />
        ) : (
          <div className="project-logo-fallback">⚡</div>
        )}

        <div className="project-titles">
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>

        <motion.span
          className="toggle-icon"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          +
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="project-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="project-desc">{project.description}</p>

            {project.technologies.length > 0 && (
              <div className="tech-tags">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tag">
                    <img
                      src={tech.logo}
                      alt=""
                      className="tech-logo-mini"
                      loading="lazy"
                    />
                    {tech.name}
                  </span>
                ))}
              </div>
            )}

            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-github-link"
                onClick={(e) => e.stopPropagation()}
              >
                <span>View on GitHub</span>
                <span className="mobile-github-arrow">→</span>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
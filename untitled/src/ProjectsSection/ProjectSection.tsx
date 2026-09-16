import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects, type Project } from '../projects';
import ProjectDetail from '../ProjectDetails/ProjectDetails';
import SocialIcons from '../Components/SocialIcons/SocialIcons';
import './project.css';

interface ProjectSectionProps {
  onBack: () => void;
}

const ProjectSection = ({ onBack }: ProjectSectionProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Un solo bottone, comportamento dinamico:
  // - se siamo nel detail → torna alla lista progetti
  // - se siamo nella lista → torna alla landing
  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="projects-page">
      <button className="back-btn" onClick={handleBack}>
        {selectedProject ? '← Projects' : '← Home'}
      </button>

      <div className="projects-content">
        <AnimatePresence mode="wait" initial={false}>
          {!selectedProject ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <header className="projects-header">
                <h1 className="projects-title">
                  <span className="gradient-text">Projects</span>
                </h1>
                <p className="projects-subtitle">
                  Things I've built — full-stack apps, security tools, and experiments.
                </p>
              </header>

              <div className="projects-grid">
                {projects.map((project) => (
                  <motion.button
                    key={project.id}
                    className="project-card"
                    onClick={() => setSelectedProject(project)}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  >
                    <div className="project-card-media">
                      {project.previewGif ? (
                        <img
                          src={project.previewGif}
                          alt={`${project.title} preview`}
                          loading="lazy"
                        />
                      ) : (
                        <div className="project-card-placeholder">No preview</div>
                      )}
                      <div className="project-card-overlay" />
                    </div>

                    <div className="project-card-body">
                      <div className="project-card-head">
                        <h2 className="project-card-title">{project.title}</h2>
                        {project.logoUrl && (
                          <img
                            src={project.logoUrl}
                            alt=""
                            className="project-card-logo"
                            loading="lazy"
                          />
                        )}
                      </div>

                      <p className="project-card-subtitle">{project.subtitle}</p>

                      <div className="project-card-footer">
                        <div className="project-card-tech">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <img
                              key={i}
                              src={tech.logo}
                              alt={tech.name}
                              title={tech.name}
                              className="project-card-tech-icon"
                              loading="lazy"
                            />
                          ))}
                        </div>
                        <span className="project-card-arrow">→</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="projects-social">
                <SocialIcons />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <ProjectDetail project={selectedProject} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectSection;
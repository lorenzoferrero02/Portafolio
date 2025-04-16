import React from 'react';
import './projectDetails.css';
import {Level} from "../Components/Level/Level.tsx";

interface ProjectDetailProps {
    project: {
        id: number;
        title: string;
        subtitle?: string;
        description: string;
        difficulty: number;
        previewGif?: string;
        videoUrl: string;
        logoUrl?: string;
        technologies: {
            name: string;
            logo: string;
        }[];
        githubRepo?: string;
    };
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
    const handleFullscreen = (element: HTMLVideoElement) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    };

    return (
        <div className="project-detail-container">
            <div className="project-content">
                <div className="project-text">
                    <div className="title-container">
                        {project.logoUrl && (
                            <img
                                src={project.logoUrl}
                                alt={`${project.title} logo`}
                                className="project-logo"
                            />
                        )}
                        <h1 className="project-title">{project.title}</h1>
                    </div>
                    {project.subtitle && <h2 className="project-subtitle">{project.subtitle}</h2>}
                    <p className="project-description">{project.description}</p>
                    {Level(project.difficulty)}

                    {/* GitHub repo link - Nuova versione migliorata */}
                    {project.githubRepo && (
                        <div className="github-repo">
                            <a
                                href={project.githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-button"
                            >
                                <span className="github-icon">
                                    <svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                                    </svg>
                                </span>
                                <span className="github-text">Vedi su GitHub</span>
                                <span className="github-arrow">→</span>
                            </a>
                        </div>
                    )}
                </div>

                <div className="project-media">
                    <video
                        className="project-video"
                        controls
                        onClick={(e) => handleFullscreen(e.currentTarget)}
                        poster={project.logoUrl}
                    >
                        <source src={"http://localhost:5173" + project.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <p className="video-hint">Click on video for fullscreen</p>

                    {project.technologies && project.technologies.length > 0 && (
                        <div className="technologies-section">
                            <h3>Tecnologie utilizzate:</h3>
                            <div className="technology-logos">
                                {project.technologies.map((tech, index) => (
                                    <div key={index} className="technology-item">
                                        <img
                                            src={tech.logo}
                                            alt={tech.name}
                                            className="technology-logo"
                                            title={tech.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
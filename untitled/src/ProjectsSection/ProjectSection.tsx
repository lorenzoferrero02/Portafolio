import { useState } from 'react';
import './project.css';
import { Avatar } from "../Components/Avatar/Avatar.tsx";
import avatar_1 from "../assets/avatar_1.jpg";
import ProjectDetail from '../ProjectDetails/ProjectDetails.tsx';
import SocialIcons from "../Components/SocialIcons/SocialIcons.tsx";
import {projects, Project} from "../projects.ts";

const ProjectSection = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <div className="project-container">
            <div className={"left-side"}>
                <div className="profile-container">
                    <Avatar className="avatar-1" src={avatar_1} alt="Profile"/>
                    <span className="gradient-text name">Lorenzo Ferrero</span>
                </div>
                <div className="side-menu">
                    <ul>
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="preview-image">
                                    {project.previewGif ? (
                                        <img src={project.previewGif} alt={`${project.title} Preview`}/>
                                    ) : (
                                        <p>No Preview</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="contact-icons">
                    <SocialIcons/>
                </div>
            </div>


            <div className="project-detail-area">
                {selectedProject ? (
                    <ProjectDetail
                        key={selectedProject.id}
                        project={selectedProject}
                    />
                ) : (
                    <div className="empty-state">
                        <h2>Seleziona un progetto</h2>
                        <p>Clicca su uno dei progetti nel menu laterale per visualizzare i dettagli</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectSection;

import { useState } from 'react';
import './project.css';
import { Avatar } from "../Components/Avatar/Avatar.tsx";
import avatar_1 from "../assets/avatar_1.jpg";
import greenswap_p from "../assets/preview/greenswap_preview.gif";
import ProjectDetail from '../ProjectDetails/ProjectDetails.tsx';
import SocialIcons from "../Components/SocialIcons/SocialIcons.tsx";
import greenswap_logo from "../assets/logo_greenswap.png";
import datav_video from "../assets/demo/Data_Analysis_video.mp4"
import datav_p from "../assets/preview/Data_Analysis_p.gif";
import lft_p from "../assets/preview/lft_p.gif";
import tonight_p from "../assets/preview/tonight_p.gif";
import tonight_logo from "../assets/logo_tonight.png";


interface Project {
    id: number;
    title: string;
    subtitle?: string;
    description: string;
    difficulty: number; // da 1 a 5
    previewGif?: string;
    videoUrl: string;
    logoUrl?: string;
    technologies: {
        name: string;
        logo: string;
    }[];
    githubRepo?: string;
}

const DifficultyAvatar = ({ difficulty }: { difficulty: number }) => {
    const avatars = [
        // Livello 1 - Facile (Sorriso tranquillo)
        <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#E8F5E9" stroke="#4CAF50" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.2" fill="#4CAF50" />
            <circle cx="15" cy="10" r="1.2" fill="#4CAF50" />
            <path d="M9 15C9 16 10.5 17 12 17C13.5 17 15 16 15 15" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="scale" values="1;1.02;1" dur="3s" repeatCount="indefinite" />
        </svg>,

        // Livello 2 - Medio (Faccina neutra)
        <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FFF8E1" stroke="#FFC107" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.2" fill="#FFC107" />
            <circle cx="15" cy="10" r="1.2" fill="#FFC107" />
            <path d="M9 15H15" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="rotate" values="0;1.5;0;-1.5;0" dur="4s" repeatCount="indefinite" />
        </svg>,

        // Livello 3 - Impegnativo (Faccina preoccupata)
        <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FFECB3" stroke="#FF9800" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.2" fill="#FF9800" />
            <circle cx="15" cy="10" r="1.2" fill="#FF9800" />
            <path d="M9 15C9 16 10.5 16.5 12 16.5C13.5 16.5 15 16 15 15" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 7L12 8" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -1;0 1;0 0" dur="2s" repeatCount="indefinite" />
        </svg>,

        // Livello 4 - Difficile (Faccina stressata)
        <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FFCDD2" stroke="#F44336" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.2" fill="#F44336" />
            <circle cx="15" cy="10" r="1.2" fill="#F44336" />
            <path d="M9 16C9 14.5 10.5 14 12 14C13.5 14 15 14.5 15 16" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 7L12 8L14 7" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="rotate" values="0;2;0;-2;0" dur="1.5s" repeatCount="indefinite" />
        </svg>,

        // Livello 5 - Estremo (Faccina esplosa)
        <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#F3E5F5" stroke="#9C27B0" strokeWidth="1.5" />
            <circle cx="8.5" cy="10" r="1.2" fill="#9C27B0" />
            <circle cx="15.5" cy="10" r="1.2" fill="#9C27B0" />
            <path d="M9 16C9 14 10.5 13.5 12 13.5C13.5 13.5 15 14 15 16" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 6L12 8" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 5L9 7" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 5L15 7" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="rotate" values="0;5;0;-5;0" dur="0.8s" repeatCount="indefinite" />
        </svg>
    ];

    return (
        <span
            className="difficulty-avatar"
            title={`Difficoltà: ${difficulty}/5`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                filter: difficulty >= 4 ? "drop-shadow(0 0 4px rgba(244, 67, 54, 0.5))" : "none",
                transition: "transform 0.2s ease, filter 0.3s ease"
            }}
        >
            {avatars[Math.min(Math.max(difficulty - 1, 0), avatars.length - 1)]}
        </span>
    );
};

const projects: Project[] = [
    {
        id: 1,
        title: "Greenswap",
        subtitle: "Eco-friendly shopping platform",
        description: "GreenSwap is a web app that promotes sustainability by enabling users to exchange unused items within a community. Users can upload products, browse listings, and request swaps with one click. The platform includes an integrated chat for easy communication and personalized profiles to match interests. By encouraging reuse, GreenSwap fosters a circular economy in an intuitive, user-friendly way.",
        difficulty: 5,
        videoUrl: "https://res.cloudinary.com/dkffmingn/video/upload/v1744797694/zghcaoymmamibiz8mc20.mp4",
        previewGif: greenswap_p,
        logoUrl: greenswap_logo,
        technologies: [
            {
                name: "React",
                logo: "https://cdn.worldvectorlogo.com/logos/react-2.svg"
            },
            {
                name: "TypeScript",
                logo: "https://cdn.worldvectorlogo.com/logos/typescript.svg"
            },
            {
                name: "PostgreSQL",
                logo: "https://cdn.worldvectorlogo.com/logos/postgresql.svg"
            }
        ],
        githubRepo: "https://github.com/lorenzoferrero02/green-swap-thesis"
    },
    {
        id: 2,
        title: "Data Analysis",
        subtitle: "Analysis on football data",
        description: "Data Analysis on Football is a Python-based project that explores and visualizes football (soccer) statistics to uncover insights and trends. Using Jupyter Notebook, the project processes datasets to analyze player performance, team dynamics, and match outcomes. Ideal for sports enthusiasts and analysts, it demonstrates how data-driven approaches can enhance understanding of the game.",
        difficulty: 1,
        videoUrl: datav_video,
        previewGif: datav_p,
        logoUrl: "https://cdn.worldvectorlogo.com/logos/python-5.svg",
        technologies: [
            {
                name: "Python",
                logo: "https://cdn.worldvectorlogo.com/logos/python-5.svg"
            },
            {
                name: "Jupiter Notebook",
                logo: "https://cdn.worldvectorlogo.com/logos/jupiter-3.svg"
            }
        ],
        githubRepo: "https://github.com/lorenzoferrero02/Data-Analysis"
    },
    {
        id: 3,
        title: "A New Programming Language",
        subtitle: "Generate an NPL with Jasmin",
        description: "This project aims to develop a compiler for a simple programming language called P, translating .lft source files into JVM bytecode. The compiler first converts P code into Jasmin assembly, which is then assembled into .class files executable on the JVM. Key constructs of P include assignments, conditionals, loops, input/output, and prefix arithmetic expressions. Jasmin is used for the final bytecode generation.",
        difficulty: 3,
        videoUrl: "https://res.cloudinary.com/dkffmingn/video/upload/v1744797676/crxax0btinuk19wm9tha.mp4",
        previewGif: lft_p,
        logoUrl: "https://cdn.worldvectorlogo.com/logos/jasmin-2.svg",
        technologies: [
            {
                name: "Java",
                logo: "https://cdn.worldvectorlogo.com/logos/java.svg"
            },
            {
                name: "Jasmin",
                logo: "https://cdn.worldvectorlogo.com/logos/jasmin-2.svg"
            }
        ],
        githubRepo: "https://github.com/lorenzoferrero02/New-Programming-Language"
    },
    {
        id: 4,
        title: "TOnight",
        subtitle: "A new app for promoting events",
        description: "This project is a web application designed to promote and manage event bookings. The interface features a \"New Events\" section with a modern, responsive UI: each event is displayed as an animated card including an image, date, prices, and buttons for booking. The user experience is enhanced by smooth animations and an eye-catching design, aimed at engaging a younger audience and making event access quick and intuitive.",
        difficulty: 3,
        videoUrl: "https://res.cloudinary.com/dkffmingn/video/upload/v1744797668/asapjmrtz3hvibx0jjz3.mp4",
        previewGif: tonight_p,
        logoUrl: tonight_logo,
        technologies: [
            {
                name: "React",
                logo: "https://cdn.worldvectorlogo.com/logos/react-2.svg"
            },
            {
                name: "TypeScript",
                logo: "https://cdn.worldvectorlogo.com/logos/typescript.svg"
            },
            {
                name: "PostgreSQL",
                logo: "https://cdn.worldvectorlogo.com/logos/postgresql.svg"
            }
        ],
        githubRepo: "https://github.com/lorenzoferrero02/TO-night"
    }

];

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
                                <h4>
                                    {project.title}
                                    <DifficultyAvatar difficulty={project.difficulty}/>
                                </h4>
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

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "../Components/Avatar/Avatar.tsx";
import { Button } from "../Components/Button/Button.tsx";
import ProjectSection from "../ProjectsSection/ProjectSection.tsx";
import "./home.css";
import avatar_1 from "../assets/avatar_1.jpg";
import ParticlesBackground from "../Components/ParticlesBackground/ParticlesBackground.tsx";
import SocialIcons from "../Components/SocialIcons/SocialIcons.tsx";

function HomeSection() {
    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };

    const [showProjects, setShowProjects] = useState(false);

    return (
        <div>
            {!showProjects ? (
                <div className="container">
                    <div className="background-wrapper">
                        <div className="parallax-bg"></div>
                        <ParticlesBackground />
                    </div>

                    <motion.div
                        className="home-container"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="avatar-wrapper">
                            <Avatar className="avatar" src={avatar_1} alt="Profile" />
                        </div>

                        <motion.h1 className="home-title" {...animationProps}>
                            Hi, I'm <span className="gradient-text">Lorenzo Ferrero</span>
                        </motion.h1>

                        <motion.p className="home-description" {...animationProps}>
                            <span className="typing-text"> Developer | UI Designer | Fintech Enthusiast</span>
                        </motion.p>

                        <motion.div {...animationProps}>
                            <Button className="discover-button" onClick={() => setShowProjects(true)}>
                                Explore my work
                            </Button>
                        </motion.div>

                        <motion.div {...animationProps}>
                            <SocialIcons />
                        </motion.div>
                    </motion.div>
                </div>
            ) : (
                <ProjectSection/>
            )}
        </div>
    );

}

export default HomeSection;
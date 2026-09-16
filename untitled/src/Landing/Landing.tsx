import { motion } from 'framer-motion';
import { Avatar } from '../Components/Avatar/Avatar';
import SocialIcons from '../Components/SocialIcons/SocialIcons';
import ParticlesBackground from '../Components/ParticlesBackground/ParticlesBackground';
import avatar_1 from '../assets/photo_2025-05-13_10-09-26.jpg';
import './landing.css';

interface LandingProps {
  onNavigate: (view: 'projects' | 'writeups') => void;
  projectCount: number;
  writeupCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SKILLS = [
  'Cybersecurity',
  'React',
  'Python',
  'Pentesting',
  'TypeScript',
  'Linux',
];

export function Landing({ onNavigate, projectCount, writeupCount }: LandingProps) {
  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="landing-parallax-bg" />
        <ParticlesBackground />
      </div>

      <motion.div
        className="landing-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="landing-avatar-wrapper">
          <Avatar className="avatar" src={avatar_1} alt="Lorenzo Ferrero" />
        </motion.div>

        <motion.p variants={itemVariants} className="landing-greeting">
          Hi, I'm
        </motion.p>

        <motion.h1 variants={itemVariants} className="landing-title">
          <span className="gradient-text">Lorenzo Ferrero</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="landing-tagline">
          <span className="typing-text">
            Developer | Cyber Engineer | Fintech Enthusiast
          </span>
        </motion.p>

        <motion.p variants={itemVariants} className="landing-bio">
          I build things, break things, and write about it. Currently focused on
          offensive security, full-stack development, and the occasional CTF.
        </motion.p>

        <motion.div variants={itemVariants} className="landing-skills">
          {SKILLS.map((skill) => (
            <span key={skill} className="landing-skill">
              {skill}
            </span>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="landing-buttons">
          <button
            className="landing-card"
            onClick={() => onNavigate('projects')}
          >
            <div className="landing-card-header">
              <span className="landing-card-icon">🚀</span>
              <span className="landing-card-count">{projectCount}</span>
            </div>
            <h2 className="landing-card-title">Projects</h2>
            <p className="landing-card-desc">
              Full-stack apps, security tools, and side experiments.
            </p>
            <span className="landing-card-cta">
              Explore <span className="landing-card-arrow">→</span>
            </span>
          </button>

          <button
            className="landing-card"
            onClick={() => onNavigate('writeups')}
          >
            <div className="landing-card-header">
              <span className="landing-card-icon">📝</span>
              <span className="landing-card-count">{writeupCount}</span>
            </div>
            <h2 className="landing-card-title">Writeups</h2>
            <p className="landing-card-desc">
              HTB machines, CTF challenges, and security notes.
            </p>
            <span className="landing-card-cta">
              Read <span className="landing-card-arrow">→</span>
            </span>
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="landing-social">
          <SocialIcons />
        </motion.div>
      </motion.div>
    </div>
  );
}
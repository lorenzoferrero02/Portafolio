import React from 'react';
import { MobileProjectsSection } from './MobileProjectSection';
import { Avatar } from '../Components/Avatar/Avatar';
import SocialIcons from '../Components/SocialIcons/SocialIcons';
import avatar_1 from '../assets/photo_2025-05-13_10-09-26.jpg';

const SKILLS = [
  'Cybersecurity',
  'React',
  'Python',
  'Pentesting',
  'TypeScript',
  'Linux',
];

export const MobileHome: React.FC = () => {
  return (
    <main className="mobile-home">
      <header className="mobile-header">
        <div className="mobile-avatar-wrapper">
          <Avatar className="mobile-avatar" src={avatar_1} alt="Lorenzo Ferrero" />
        </div>

        <p className="mobile-greeting">Hi, I'm</p>
        <h1 className="mobile-name">
          <span className="gradient-text">Lorenzo Ferrero</span>
        </h1>
        <p className="mobile-tagline">
          Developer | Cyber Engineer | Fintech Enthusiast
        </p>

        <div className="mobile-skills">
          {SKILLS.map((skill) => (
            <span key={skill} className="mobile-skill">
              {skill}
            </span>
          ))}
        </div>

        <div className="mobile-social">
          <SocialIcons />
        </div>
      </header>

      <section className="mobile-section">
        <h2 className="mobile-section-title">About</h2>
        <div className="mobile-about-card">
          <p>
            Master's student in Cyber Security at Politecnico di Torino.
            Passionate about offensive security, full-stack development, and
            the occasional CTF.
          </p>
        </div>
      </section>

      <MobileProjectsSection />
    </main>
  );
};
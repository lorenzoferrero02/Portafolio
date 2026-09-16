import { useState } from 'react';
import { useIsMobile } from './hooks';
import { MobileApp } from './Mobile/MobileApp';
import { Landing } from './Landing/Landing';
import { Writeups } from './Writeups/Writeups';
import { projects } from './projects';
import { writeups } from './Writeups/loader';
import './App.css';
import ProjectSection from './ProjectsSection/ProjectSection';

type View = 'landing' | 'projects' | 'writeups';

export function App() {
  const isMobile = useIsMobile(768);
  const [view, setView] = useState<View>('landing');

  if (view === 'landing') {
    return (
      <Landing
        onNavigate={setView}
        projectCount={projects.length}
        writeupCount={writeups.length}
      />
    );
  }

  if (view === 'writeups') {
    return <Writeups onBack={() => setView('landing')} />;
  }

  // view === 'projects'
  return (
    <>
      <button className="back-btn" onClick={() => setView('landing')}>
        ← Home
      </button>
      {isMobile ? (
        <MobileApp />
      ) : (
        <div className="desktop-container">
          <ProjectSection onBack={() => setView('landing')} />
        </div>
      )}
    </>
  );
}

export default App;
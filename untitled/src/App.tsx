import { useIsMobile } from './hooks';
import { MobileApp } from './Mobile/MobileApp';
// Importa i tuoi componenti desktop esistenti
import HomeSection from './Home/HomeSection'; 
import './App.css';

export function App() {
  const isMobile = useIsMobile(768);

  if (isMobile) {
    return <MobileApp />;
  }

  return (
    <div className="desktop-container">
      <HomeSection />
      {/* Altri componenti desktop esistenti */}
    </div>
  );
}

export default App;
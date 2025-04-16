import Particles from 'react-tsparticles';

const ParticlesBackground = () => (
    <Particles
        options={{
            particles: {
                number: { value: 80 },
                size: { value: 3 },
                move: { enable: true, speed: 2 },
                opacity: { value: 0.5 },
                links: { enable: true, distance: 150 }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "repulse" }
                }
            }
        }}
    />
);

export default ParticlesBackground;
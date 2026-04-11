import { useState } from 'react';
import doorClosedArch from '@/assets/door_closed_arch.png';
import doorOpenedArch from '@/assets/door_opened_arch.png';

interface DoorEntranceProps {
  onEnter: () => void;
}

export function DoorEntrance({ onEnter }: DoorEntranceProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Step 3 of Animation (The Reveal): At 1.5s into the zoom, fade out the parent
    setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    // Cleanup: Once the fade-out is complete (1s later), unmount
    setTimeout(() => {
      onEnter();
    }, 2500);
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{ 
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000', // Keeps things dark during the zoom void
        zIndex: 100,
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      {/* Full-Screen Zoom Container */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: isOpening ? 'scale(15)' : 'scale(1)',
          transition: 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: '50% 55%', // Approximately center of the black opening
        }}
      >
        <img 
          src={isOpening ? doorOpenedArch : doorClosedArch} 
          alt="Entrance" 
          className="w-full h-full block"
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
          }}
        />
      </div>

      {/* Intro Overlay UI */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        style={{
          opacity: isOpening ? 0 : 1,
          transition: 'opacity 0.3s ease-out', // Step 1: Immediately fade out
        }}
      >
        <h1 
          className="mb-10 text-center px-6"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 400,
            color: '#FAF6F0',
            textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 50px rgba(92, 50, 16, 0.5)',
            letterSpacing: '0.05em'
          }}
        >
          Lama & Álvaro
        </h1>
        
        <div 
          className="btn-primary pointer-events-auto cursor-pointer"
          onClick={handleClick}
        >
          Enter
        </div>

        <div 
          className="absolute bottom-16 text-center"
          style={{
            fontFamily: 'var(--font-cinzel)',
            color: '#FAF6F0',
            fontSize: '0.65rem',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          Click to enter the story
        </div>
      </div>
    </div>
  );
}
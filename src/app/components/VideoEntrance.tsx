import { useState, useRef } from 'react';
import doorClosedArch from '@/assets/door_closed_arch.png';
import knockerImg from '@/assets/knocker.png';

interface VideoEntranceProps {
  onEnter: () => void;
}

export function VideoEntrance({ onEnter }: VideoEntranceProps) {
  const [phase, setPhase] = useState<'splash' | 'fading' | 'video'>('splash');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    // Start fading the splash out, video is already preloaded in the background
    setPhase('fading');

    // After the fade (0.6s), switch to video view and play
    setTimeout(() => {
      setPhase('video');
      if (videoRef.current) {
        videoRef.current.play().catch(() => onEnter());
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden">

      {/* ── VIDEO (always mounted so it preloads, just hidden until needed) ── */}
      <style>{`
        @keyframes walk-in {
          from { transform: scale(1); }
          to   { transform: scale(5); }
        }
        .video-walk-in {
          animation: walk-in 30s linear forwards;
          transform-origin: center center;
        }
        @keyframes subtle-swing {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1.5deg); }
          100% { transform: rotate(0deg); }
        }
        .knocker-hover {
          transition: transform 0.5s ease-out;
        }
        .group:hover .knocker-hover {
          animation: subtle-swing 2s ease-in-out infinite;
        }
      `}</style>

      <video
        ref={videoRef}
        src="/door_video.mp4"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${phase === 'video' ? 'video-walk-in' : ''}`}
        style={{ opacity: phase === 'video' ? 1 : 0 }}
        onEnded={onEnter}
        playsInline
        preload="auto"
      />

      {/* ── SPLASH SCREEN (door image + button, fades out on click) ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-[600ms]`}
        style={{
          opacity: phase === 'splash' ? 1 : 0,
          pointerEvents: phase === 'splash' ? 'auto' : 'none'
        }}
      >
        {/* Door Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
          <img
            src={doorClosedArch}
            alt="Entrance"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center bottom' }}
          />
        </div>

        {/* Text & Button */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-6">
          <h1
            className="mb-12 text-[#FAF6F0]"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 300,
              letterSpacing: '0.1em',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)'
            }}
          >
            Lama & Álvaro
          </h1>

          {/* Thematic Knocker Button */}
          <div 
            onClick={handleStart}
            className="group relative cursor-pointer flex flex-col items-center"
          >
            {/* Photorealistic Knocker Image */}
            <div className="relative w-40 h-40 mb-4 transition-all duration-700 ease-out group-hover:scale-110">
              <div className="absolute inset-0 rounded-full bg-[#1a0f08]/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src={knockerImg} 
                alt="Door Knocker"
                className="w-full h-full object-contain knocker-hover"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.05) contrast(1.1)',
                  maskImage: 'radial-gradient(circle, black 65%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 100%)'
                }}
              />
              <div className="absolute inset-0 bg-accent-terracotta/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>

            {/* Label */}
            <div className="text-center space-y-3">
              <span className="block font-serif text-[#FAF6F0] text-3xl tracking-[0.05em] italic transition-all duration-500 group-hover:text-[#E2C38A] drop-shadow-lg">
                Knock to Enter
              </span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-[1px] bg-white/20 transition-all duration-700 group-hover:w-32 group-hover:bg-[#E2C38A] shadow-[0_0_10px_rgba(226,195,138,0.5)]" />
                <p className="mt-4 font-cinzel text-white/40 text-[9px] tracking-[0.4em] uppercase">
                  Open the story
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skip button */}
      {phase === 'video' && (
        <button
          onClick={onEnter}
          className="absolute bottom-10 right-10 text-white/30 hover:text-white/60 font-cinzel text-[10px] tracking-[0.3em] uppercase transition-colors z-10"
        >
          Skip
        </button>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import doorClosedArch from '@/assets/door_closed_arch.png';

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
        className="absolute inset-0 transition-opacity duration-600"
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

          <button
            onClick={handleStart}
            className="group relative px-12 py-5 overflow-hidden rounded-full border border-white/30 bg-white/5 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white/50 active:scale-95"
          >
            <span className="relative z-10 font-cinzel text-white text-xs tracking-[0.5em] uppercase font-bold">
              Play Story
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          <div className="mt-16 animate-pulse">
            <p className="font-cinzel text-white/40 text-[9px] tracking-[0.4em] uppercase">
              Click to begin
            </p>
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

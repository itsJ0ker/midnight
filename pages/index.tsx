// index.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";

export default function Home() {
  const [audioOn, setAudioOn] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [bootDone, setBootDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bootLogs = [
    "[BOOT] Midnight Club System v1.0 initializing...",
    "[OK] Loading encrypted modules...",
    "[OK] Establishing secure uplink...",
    "[OK] Authenticating members...",
    "[OK] Preparing secret terminal...",
    ">>> ACCESS GRANTED <<<",
  ];

  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [audioOn, volume]);

  useEffect(() => {
    if (logIndex < bootLogs.length) {
      const timer = setTimeout(() => setLogIndex((prev) => prev + 1), 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setBootDone(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [logIndex]);

  // Boot-only CRT overlay
  const BootCRTOverlay = () => (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:100%_3px] mix-blend-overlay"></div>
      <div className="pointer-events-none absolute inset-0 animate-[flicker_2s_infinite] bg-green-500/5"></div>
      <style jsx global>{`
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 100% {
            opacity: 0.99;
          }
          20%, 21.999%, 63%, 63.999% {
            opacity: 0.4;
          }
        }
      `}</style>
    </>
  );

  // Boot Screen
  if (!bootDone) {
    return (
      <div className="relative flex flex-col justify-center items-start min-h-screen bg-black text-green-400 font-mono p-6 overflow-hidden">
        {bootLogs.slice(0, logIndex).map((line, i) => (
          <motion.p
            key={i}
            className="text-sm sm:text-base mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {line}
          </motion.p>
        ))}

        <motion.span
          className="text-green-500 text-lg mt-2"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          █
        </motion.span>

        <BootCRTOverlay />
      </div>
    );
  }

  // Main Screen (clean, no overlay)
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono px-4 overflow-hidden">
      {/* ===== Top Menu ===== */}
      <div className="absolute top-4 right-6 flex gap-3">
        <a
          href="/ApplicationForm"
          className="px-4 py-2 border border-green-400 rounded-md hover:bg-green-500 hover:text-black transition shadow-[0_0_12px_#00ff00] text-sm"
        >
          FORM
        </a>
        <a
          href="/AdminPage"
          className="px-4 py-2 border border-green-400 rounded-md hover:bg-green-500 hover:text-black transition shadow-[0_0_12px_#00ff00] text-sm flex items-center gap-1"
        >
          <FaUserShield /> ADMIN
        </a>
      </div>

      <motion.h1
        className="font-extrabold text-green-400
                   text-3xl sm:text-5xl md:text-7xl 
                   drop-shadow-[0_0_25px_#00ff00] 
                   tracking-[0.15em] leading-tight text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        THE MIDNIGHT CLUB
      </motion.h1>

      <motion.span
        className="text-green-500 text-2xl mt-2"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        █
      </motion.span>

      <motion.p
        className="mt-4 text-green-300 text-sm sm:text-lg tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        ⚠ WEBSITE UNDER DEVELOPMENT ⚠
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <a
          href="https://www.instagram.com/themidnightclub.xyz"
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 border border-green-400 
                     rounded-lg hover:bg-green-500 hover:text-black transition 
                     shadow-[0_0_15px_#00ff00]"
        >
          <FaInstagram /> Instagram
        </a>
        <a
          href="/ApplicationForm"
          className="flex items-center gap-2 px-6 py-3 border border-green-400 
                     rounded-lg hover:bg-green-500 hover:text-black transition 
                     shadow-[0_0_15px_#00ff00]"
        >
          <MdOutlineAppRegistration /> Apply Now
        </a>
      </motion.div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={() => setAudioOn(!audioOn)}
          className="px-5 py-2 rounded-lg border border-green-500 text-green-400 
                     font-semibold tracking-wider
                     hover:bg-green-500 hover:text-black 
                     transition-all duration-300 shadow-lg shadow-green-500/30 
                     hover:shadow-green-500/60"
        >
          {audioOn ? "🔊 SOUND ON" : "🔇 SOUND OFF"}
        </button>

        <div className="relative w-48">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={`w-full h-2 appearance-none bg-gray-800 rounded-lg
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-green-500
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e]
                       ${audioOn ? "animate-pulse" : ""}`}
          />
          <div
            className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-green-500/30 blur-md
                        ${audioOn ? "animate-pulse" : ""}`}
          ></div>
        </div>
      </div>

      <audio ref={audioRef} src="/ambient.mp3" loop />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";

export default function Home() {
  const [audioOn, setAudioOn] = useState(false);
  const [volume, setVolume] = useState(0.2); // default volume
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [audioOn, volume]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Title */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-red-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        THE MIDNIGHT CLUB
      </motion.h1>

      {/* Subtitle */}
      <p className="mt-4 text-gray-400 text-lg">🚧 Under Development 🚧</p>

      {/* Buttons */}
      <div className="flex gap-6 mt-8">
        <a
          href="https://www.instagram.com/themidnightclub.xyz"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-red-500 rounded-xl hover:bg-red-500 hover:text-black transition"
        >
          <FaInstagram /> Instagram
        </a>
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 border border-red-500 rounded-xl hover:bg-red-500 hover:text-black transition"
        >
          <MdOutlineAppRegistration /> Apply Now
        </a>
      </div>

      {/* Sound toggle + Volume Control */}
      <div className="mt-12 flex flex-col items-center gap-4">
        {/* Sound Button */}
        <button
          onClick={() => setAudioOn(!audioOn)}
          className="px-5 py-2 rounded-lg border border-red-500 text-red-400 
                     font-semibold tracking-wider
                     hover:bg-red-500 hover:text-black 
                     transition-all duration-300 shadow-lg shadow-red-500/30 
                     hover:shadow-red-500/60"
        >
          {audioOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>

        {/* Neon Slider */}
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
                       [&::-webkit-slider-thumb]:bg-red-500
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_10px_#ef4444,0_0_20px_#ef4444]
                       ${audioOn ? "animate-pulse" : ""}`}
          />
          {/* Neon Glow Behind Track */}
          <div
            className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-red-500/30 blur-md
                        ${audioOn ? "animate-pulse" : ""}`}
          ></div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/ambient.mp3" loop />
    </div>
  );
}

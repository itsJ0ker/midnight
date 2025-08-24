// index.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";

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
       {/* Background Effects */}
       <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
       </div>
      
      {/* ===== Enhanced Top Menu ===== */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-center z-10">
        {/* Left side - Home indicator */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-green-500/30 rounded-lg bg-black/50 backdrop-blur-sm">
          <FaHome className="text-green-400 text-xs sm:text-sm" />
          <span className="text-green-400 text-xs font-semibold tracking-wider hidden sm:inline">HOME</span>
        </div>

        {/* Right side - Navigation buttons */}
        <div className="flex gap-1 sm:gap-2">
          <a
            href="/ApplicationForm"
            className="flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 border border-green-400 rounded-lg 
                       hover:bg-green-500 hover:text-black transition-all duration-300 
                       shadow-[0_0_12px_#00ff00] text-xs sm:text-sm font-semibold tracking-wider
                       hover:shadow-[0_0_20px_#00ff00] hover:scale-105"
          >
            <MdOutlineAppRegistration className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">FORM</span>
            <span className="sm:hidden">F</span>
          </a>
          <a
            href="/AvyuktForm"
            className="flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 border border-green-400 rounded-lg 
                       hover:bg-green-500 hover:text-black transition-all duration-300 
                       shadow-[0_0_12px_#00ff00] text-xs sm:text-sm font-semibold tracking-wider
                       hover:shadow-[0_0_20px_#00ff00] hover:scale-105
                       bg-gradient-to-r from-green-500/10 to-transparent"
          >
            <FaCode className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">AVYUKT DEV</span>
            <span className="sm:hidden">DEV</span>
          </a>
          <a
            href="/AdminPage"
            className="flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 border border-green-400 rounded-lg 
                       hover:bg-green-500 hover:text-black transition-all duration-300 
                       shadow-[0_0_12px_#00ff00] text-xs sm:text-sm font-semibold tracking-wider
                       hover:shadow-[0_0_20px_#00ff00] hover:scale-105"
          >
            <FaUserShield className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">ADMIN</span>
            <span className="sm:hidden">A</span>
          </a>
        </div>
      </div>


      <motion.h1
        className="font-extrabold text-green-400
                   text-3xl sm:text-5xl md:text-7xl 
                   drop-shadow-[0_0_25px_#00ff00] 
                   tracking-[0.15em] leading-tight text-center
                   mt-20 sm:mt-24 md:mt-28"
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
         className="mt-4 text-green-300 text-sm sm:text-lg tracking-widest text-center max-w-2xl"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1, duration: 1 }}
       >
         🚀 ELITE DEVELOPMENT TEAM • INNOVATION • EXCELLENCE 🚀
       </motion.p>

       {/* Feature Cards */}
       <motion.div
         className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full"
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 1.2, duration: 0.8 }}
       >
         <motion.div
           className="p-6 border border-green-500/30 rounded-lg bg-black/40 backdrop-blur-sm
                      hover:border-green-400 hover:bg-black/60 transition-all duration-300
                      hover:shadow-[0_0_20px_#22c55e] group"
           whileHover={{ scale: 1.05 }}
         >
           <div className="flex items-center gap-3 mb-4">
             <FaRocket className="text-green-400 text-2xl group-hover:text-green-300 transition-colors" />
             <h3 className="text-green-200 font-semibold text-lg">Innovation Hub</h3>
           </div>
           <p className="text-green-300 text-sm leading-relaxed">
             Cutting-edge projects and revolutionary ideas. We push the boundaries of what's possible.
           </p>
         </motion.div>

         <motion.div
           className="p-6 border border-green-500/30 rounded-lg bg-black/40 backdrop-blur-sm
                      hover:border-green-400 hover:bg-black/60 transition-all duration-300
                      hover:shadow-[0_0_20px_#22c55e] group"
           whileHover={{ scale: 1.05 }}
         >
           <div className="flex items-center gap-3 mb-4">
             <FaUsers className="text-green-400 text-2xl group-hover:text-green-300 transition-colors" />
             <h3 className="text-green-200 font-semibold text-lg">Elite Team</h3>
           </div>
           <p className="text-green-300 text-sm leading-relaxed">
             Join the most talented developers, designers, and innovators in the industry.
           </p>
         </motion.div>

         <motion.div
           className="p-6 border border-green-500/30 rounded-lg bg-black/40 backdrop-blur-sm
                      hover:border-green-400 hover:bg-black/60 transition-all duration-300
                      hover:shadow-[0_0_20px_#22c55e] group"
           whileHover={{ scale: 1.05 }}
         >
           <div className="flex items-center gap-3 mb-4">
             <FaLaptopCode className="text-green-400 text-2xl group-hover:text-green-300 transition-colors" />
             <h3 className="text-green-200 font-semibold text-lg">Tech Excellence</h3>
           </div>
           <p className="text-green-300 text-sm leading-relaxed">
             Master the latest technologies and build solutions that change the world.
           </p>
         </motion.div>
       </motion.div>

       <motion.div
         className="flex flex-col sm:flex-row gap-4 mt-12"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.8, duration: 1 }}
       >
         <a
           href="https://www.instagram.com/themidnightclub.xyz"
           target="_blank"
           className="flex items-center gap-2 px-8 py-4 border border-green-400 
                      rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300
                      shadow-[0_0_15px_#00ff00] hover:shadow-[0_0_25px_#00ff00] hover:scale-105
                      font-semibold tracking-wider"
         >
           <FaInstagram className="text-lg" /> Follow Us
         </a>
         <a
           href="/ApplicationForm"
           className="flex items-center gap-2 px-8 py-4 border border-green-400 
                      rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300
                      shadow-[0_0_15px_#00ff00] hover:shadow-[0_0_25px_#00ff00] hover:scale-105
                      font-semibold tracking-wider"
         >
           <MdOutlineAppRegistration className="text-lg" /> Join Now
         </a>
         <a
           href="/AvyuktForm"
           className="flex items-center gap-2 px-8 py-4 border border-green-400 
                      rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300
                      shadow-[0_0_15px_#00ff00] hover:shadow-[0_0_25px_#00ff00] hover:scale-105
                      font-semibold tracking-wider bg-gradient-to-r from-green-500/20 to-transparent"
         >
           <FaCode className="text-lg" /> Avyukt Dev
         </a>
       </motion.div>

             {/* Audio Controls */}
       <motion.div 
         className="mt-16 flex flex-col items-center gap-4"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2.2, duration: 1 }}
       >
         <div className="flex items-center gap-4">
           <button
             onClick={() => setAudioOn(!audioOn)}
             className="px-6 py-3 rounded-lg border border-green-500 text-green-400 
                        font-semibold tracking-wider
                        hover:bg-green-500 hover:text-black 
                        transition-all duration-300 shadow-lg shadow-green-500/30 
                        hover:shadow-green-500/60 hover:scale-105"
           >
             {audioOn ? "🔊 SOUND ON" : "🔇 SOUND OFF"}
           </button>
           
           <div className="flex items-center gap-3">
             <span className="text-green-400 text-sm font-semibold">VOLUME</span>
             <div className="relative w-32">
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
         </div>
         
         {/* Footer Info */}
         <motion.div 
           className="mt-8 text-center"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2.5, duration: 1 }}
         >
           <p className="text-green-500/60 text-xs tracking-widest">
             © 2025 THE MIDNIGHT CLUB • ELITE DEVELOPMENT TEAM
           </p>
           <p className="text-green-500/40 text-xs mt-1">
             Built with ❤️ for the future of technology by Harsh
           </p>
         </motion.div>
       </motion.div>

      <audio ref={audioRef} src="/ambient.mp3" loop />
    </div>
  );
}

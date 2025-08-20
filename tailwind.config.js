/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./pages/**/*.{js,ts,jsx,tsx}",
"./components/**/*.{js,ts,jsx,tsx}",
"./app/**/*.{js,ts,jsx,tsx}"
],
theme: {
extend: {
colors: {
neon: {
red: "#ff1744",
soft: "#ff5771"
}
},
fontFamily: {
mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
display: ["Orbitron", "Oxanium", "Bank Gothic", "Poppins", "sans-serif"]
},
boxShadow: {
neon: "0 0 8px rgba(255,23,68,.75), 0 0 24px rgba(255,23,68,.35)",
neonHard: "0 0 2px #ff1744, 0 0 8px #ff1744, inset 0 0 8px rgba(255,23,68,.35)"
},
keyframes: {
flicker: {
"0%,19%,21%,23%,25%,54%,56%,100%": { opacity: "1" },
"20%,24%,55%": { opacity: ".35" }
},
float: {
"0%": { transform: "translateY(0px)" },
"50%": { transform: "translateY(-6px)" },
"100%": { transform: "translateY(0px)" }
}
},
animation: {
flicker: "flicker 2.2s infinite",
float: "float 6s ease-in-out infinite"
}
}
},
plugins: []
}
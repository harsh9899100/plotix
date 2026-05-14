import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { display:["var(--font-cormorant)","Georgia","serif"], body:["var(--font-dm-sans)","system-ui","sans-serif"] },
      colors: {
        brand: { 50:"#fdf8f0",100:"#faefd9",200:"#f3d9a8",300:"#eabd70",400:"#de9d3e",500:"#c9832a",600:"#b06320",700:"#8e4a1d",800:"#743d1e",900:"#61341c" },
      },
      boxShadow: {
        card:"0 1px 3px rgba(0,0,0,.05)",
        "card-hover":"0 10px 40px -10px rgba(0,0,0,.12),0 4px 16px -4px rgba(0,0,0,.08)",
        "map-popup":"0 8px 32px rgba(0,0,0,.16)",
      },
      animation: {
        "fade-up":"fadeUp .5s ease-out both",
        "fade-in":"fadeIn .4s ease-out both",
        "slide-in":"slideIn .3s ease-out both",
        "slide-up":"slideUp .35s cubic-bezier(.32,.72,0,1) both",
      },
      keyframes: {
        fadeUp:  { "0%":{opacity:"0",transform:"translateY(16px)"},"100%":{opacity:"1",transform:"none"} },
        fadeIn:  { "0%":{opacity:"0"},"100%":{opacity:"1"} },
        slideIn: { "0%":{opacity:"0",transform:"translateX(-12px)"},"100%":{opacity:"1",transform:"none"} },
        slideUp: { "0%":{opacity:"0",transform:"translateY(100%)"},"100%":{opacity:"1",transform:"none"} },
      },
    },
  },
  plugins: [],
}
export default config

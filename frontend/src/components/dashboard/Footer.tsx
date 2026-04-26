import { Heart, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-white/[0.04] bg-[hsl(220,14%,4%)]/90 backdrop-blur-xl py-3 z-[100]">
      <div className="container mx-auto px-6 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white/60 tracking-tight">SCM</span>
          <span className="text-white/10">·</span>
          <span className="text-white/20">Smart Crop Monitoring</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white/15 hidden md:inline">Made by Group 4 CSSE A</span>
          <div className="flex gap-2">
            <a href="https://github.com/realanuragsharma" target="_blank" rel="noopener noreferrer"
               className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-300 text-white/25 hover:text-white/60">
              <Github className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.linkedin.com/in/anurag-sharma-215b72382/" target="_blank" rel="noopener noreferrer"
               className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-300 text-white/25 hover:text-white/60">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

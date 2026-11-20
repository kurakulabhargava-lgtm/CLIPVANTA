import Link from "next/link";
import { Scissors, Sparkles, FolderVideo, PlusCircle } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-sky-500/10 border border-sky-500/30 p-2 rounded-xl text-sky-400">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
            ClipVanta <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30">AI Agent</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition px-3 py-2 rounded-lg"
          >
            <FolderVideo className="w-4 h-4" />
            Projects
          </Link>
          <Link
            href="/new"
            className="flex items-center gap-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-black px-4 py-2 rounded-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            New Project
          </Link>
        </nav>
      </div>
    </header>
  );
}

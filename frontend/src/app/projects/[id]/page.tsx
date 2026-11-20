"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Sparkles, CheckCircle2, Copy, Download, Share2, 
  Layers, ChevronRight, Play, Check 
} from "lucide-react";
import { getProjectClips, Clip } from "@/lib/api";

export default function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    const fetchClips = async () => {
      const data = await getProjectClips(projectId);
      setClips(data);
      if (data.length > 0 && !selectedClip) {
        setSelectedClip(data[0]);
      }
      setLoading(false);
    };

    fetchClips();
    interval = setInterval(fetchClips, 4000);
    return () => clearInterval(interval);
  }, [projectId]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs uppercase font-bold text-sky-400 bg-sky-950/40 border border-sky-800 px-2.5 py-1 rounded-full">
            Autonomous Production Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">Project Highlights & Clip Studio</h1>
          <p className="text-xs text-zinc-400 mt-1">Project ID: {projectId}</p>
        </div>
      </div>

      {loading && clips.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-zinc-400">Processing video through ClipVanta 9-agent pipeline...</p>
        </div>
      ) : clips.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-200">Processing in Progress</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            The agents are transcribing audio, calculating 100-point highlight scores, and reframing 9:16 vertical video.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Clips List */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Ranked Highlights ({clips.length})
            </h2>
            <div className="space-y-3">
              {clips.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => setSelectedClip(clip)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between ${
                    selectedClip?.id === clip.id
                      ? "bg-zinc-900 border-sky-500/50 shadow-md shadow-sky-500/10"
                      : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Clip #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Score {clip.score}/100
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-zinc-200 line-clamp-1">{clip.title}</div>
                    <div className="text-xs text-zinc-500">{clip.duration.toFixed(1)}s duration</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Active Clip Preview & Publishing Meta */}
          {selectedClip && (
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
                {/* 9:16 Vertical Preview Frame */}
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-[240px] aspect-[9/16] bg-black rounded-2xl border border-zinc-800 overflow-hidden flex flex-col items-center justify-center relative shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                    <Play className="w-12 h-12 text-sky-400 opacity-80" />
                    <div className="absolute bottom-4 left-3 right-3 text-center">
                      <span className="text-xs font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase">
                        AI Animated Subtitles
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full max-w-[240px] py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition">
                    <Download className="w-4 h-4" /> Download 9:16 MP4
                  </button>
                </div>

                {/* Commentary & 100-Point Score Breakdown */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs uppercase font-bold text-zinc-400 mb-2">100-Point Score Analysis</h3>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                      {Object.entries(selectedClip.score_breakdown).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center text-zinc-400">
                          <span className="capitalize">{key.replace("_", " ")}</span>
                          <span className="font-semibold text-white">{val} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase font-bold text-zinc-400 mb-2">AI Commentary</h3>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300 space-y-2">
                      <p>
                        <strong className="text-sky-400">Hook:</strong> {selectedClip.commentary_script?.hook}
                      </p>
                      <p>
                        <strong className="text-emerald-400">Context:</strong> {selectedClip.commentary_script?.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Export Copy */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-400" />
                  Social Media Publishing Package
                </h3>

                <div className="space-y-3">
                  {/* YouTube Shorts */}
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-red-400 uppercase">YouTube Shorts Title</div>
                      <div className="text-sm text-zinc-200 mt-1">
                        {selectedClip.social_metadata?.youtube_shorts?.title || "Shorts Title"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedClip.social_metadata?.youtube_shorts?.title || "",
                          "yt"
                        )
                      }
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                    >
                      {copiedKey === "yt" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* TikTok Caption */}
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-pink-400 uppercase">TikTok Caption</div>
                      <div className="text-sm text-zinc-200 mt-1">
                        {selectedClip.social_metadata?.tiktok?.caption || "TikTok caption"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedClip.social_metadata?.tiktok?.caption || "",
                          "tt"
                        )
                      }
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                    >
                      {copiedKey === "tt" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

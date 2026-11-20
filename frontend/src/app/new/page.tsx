"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Upload, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { createYouTubeProject, uploadVideoProject } from "@/lib/api";

export default function NewProject() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"youtube" | "upload">("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightsConfirmed) {
      setError("You must confirm content rights before processing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let project;
      if (activeTab === "youtube") {
        if (!youtubeUrl) throw new Error("Please enter a valid YouTube URL");
        project = await createYouTubeProject(youtubeUrl, projectTitle);
      } else {
        if (!file) throw new Error("Please select a video file to upload");
        project = await uploadVideoProject(file, projectTitle || file.name);
      }

      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to initiate project.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Create New Video Project</h1>
        <p className="text-zinc-400 text-sm mt-2">
          Provide a YouTube link or upload an authorized video file. ClipVanta will handle transcription, highlight scoring, and 9:16 re-editing.
        </p>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-xl">
        {/* Input Toggle */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition ${
              activeTab === "youtube"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Youtube className="w-4 h-4 text-red-500" />
            YouTube Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition ${
              activeTab === "upload"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Upload className="w-4 h-4 text-sky-400" />
            Video Upload
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase font-bold text-zinc-400 mb-2">Project Title</label>
            <input
              type="text"
              placeholder="e.g. AI Breakthrough Podcast Highlights"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 text-white"
            />
          </div>

          {activeTab === "youtube" ? (
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-400 mb-2">Public YouTube URL</label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 text-white"
              />
              <p className="text-xs text-zinc-500 mt-2">
                Permitted metadata and public transcripts will be retrieved without bypassing platform protection.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-400 mb-2">Select Video File</label>
              <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-700 transition">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
                <p className="text-xs text-zinc-500 mt-2">Supports MP4, MOV, WebM up to 500MB</p>
              </div>
            </div>
          )}

          {/* Mandatory Content Rights Confirmation */}
          <div className="bg-sky-950/20 border border-sky-900/50 rounded-2xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="rights"
              required
              checked={rightsConfirmed}
              onChange={(e) => setRightsConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="rights" className="text-xs text-zinc-300 leading-relaxed cursor-pointer select-none">
              <span className="font-semibold text-white block mb-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 inline" /> Content Rights Confirmation
              </span>
              I certify that I own this video or have explicit permission to process, adapt, and produce derivative clips from this source.
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !rightsConfirmed}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Initiating Autonomous Pipeline...
              </>
            ) : (
              <>
                Start Autonomous Clipping
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

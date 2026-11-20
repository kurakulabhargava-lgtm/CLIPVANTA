"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Video, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getProjects, Project } from "@/lib/api";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const totalClips = projects.reduce((acc, p) => acc + (p.clips_count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your autonomous video clipping projects and review AI-generated vertical shorts.
          </p>
        </div>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-sm">
            <span>Total Projects</span>
            <Video className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">{projects.length}</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-sm">
            <span>Generated Clips</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">{totalClips}</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-sm">
            <span>Active Pipeline</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold mt-2 text-white">
            {projects.filter((p) => p.status === "processing").length}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Recent Projects</h2>
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-zinc-300">No projects yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
              Paste a YouTube link or upload your first long-form video to let ClipVanta extract viral highlights.
            </p>
            <Link
              href="/new"
              className="inline-flex items-center gap-2 bg-sky-500 text-black font-semibold px-4 py-2 rounded-xl text-sm hover:bg-sky-400 transition"
            >
              <Plus className="w-4 h-4" /> Start First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group block bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {project.source_type}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    {project.status === "completed" && (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    )}
                    {project.status === "processing" && (
                      <span className="text-sky-400 flex items-center gap-1 font-medium animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> Processing {project.progress_percent}%
                      </span>
                    )}
                    {project.status === "failed" && (
                      <span className="text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-zinc-100 group-hover:text-sky-400 transition line-clamp-1">
                  {project.title}
                </h3>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-800/80">
                  <span>{project.clips_count} vertical clips</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

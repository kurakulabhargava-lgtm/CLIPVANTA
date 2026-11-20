const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Project {
  id: string;
  title: string;
  source_type: "youtube" | "upload";
  source_url?: string;
  duration_sec: number;
  rights_confirmed: boolean;
  status: "created" | "processing" | "completed" | "failed";
  current_stage: string;
  progress_percent: number;
  error_message?: string;
  clips_count: number;
  created_at: string;
}

export interface Clip {
  id: string;
  project_id: string;
  title: string;
  start_time: number;
  end_time: number;
  duration: number;
  score: number;
  score_breakdown: Record<string, number>;
  commentary_script: {
    hook: string;
    explanation: string;
    outro: string;
    full_script: string;
  };
  video_url?: string;
  thumbnail_url?: string;
  social_metadata: {
    youtube_shorts?: { title: string; description: string; tags: string[] };
    instagram_reels?: { caption: string; hashtags: string[] };
    tiktok?: { caption: string; tags: string[] };
  };
  qa_passed: boolean;
  created_at: string;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch projects", err);
    return [];
  }
}

export async function createYouTubeProject(url: string, title?: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title || "YouTube Video Project",
      source_type: "youtube",
      source_url: url,
      rights_confirmed: true,
    }),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return await res.json();
}

export async function uploadVideoProject(file: File, title: string): Promise<Project> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("rights_confirmed", "true");

  const res = await fetch(`${API_BASE}/projects/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload video");
  return await res.json();
}

export async function getProjectClips(projectId: string): Promise<Clip[]> {
  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}/clips`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch clips", err);
    return [];
  }
}

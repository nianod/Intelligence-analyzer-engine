
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export interface ArchitectureType {
  type: string;
  confidence: number;
  signals: string[];
}

export interface ArchitecturePattern {
  name: string;
  evidence: string[];
}

export interface TopLevelDir {
  name: string;
  files: number;
  share: number;
}

export interface ArchitectureMetrics {
  total_files: number;
  total_directories: number;
  root_files: number;
  max_depth: number;
  avg_depth: number;
  largest_top_level_dir: string;
  largest_dir_share: number;
  top_level_dirs: TopLevelDir[];
}

export interface ScoreItem {
  score: number;
  max: number;
}

export interface ArchitectureScore {
  overall: number;
  grade: string;
  breakdown: {
    separation_of_concerns: ScoreItem;
    organization: ScoreItem;
    conventions: ScoreItem;
    balance: ScoreItem;
  };
}

export interface ArchitectureResult {
  repo: string;
  architecture: ArchitectureType;
  patterns: ArchitecturePattern[];
  metrics: ArchitectureMetrics;
  score: ArchitectureScore;
  recommendations: string[];
  truncated: boolean;
}

export async function fetchArchitecture(
  owner: string,
  repo: string
): Promise<ArchitectureResult> {
  const res = await fetch(
    `${BASE_URL}/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/architecture`
  );

  if (!res.ok) {
    let message = `Architecture analysis failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch {
       //No response
    }
    throw new Error(message);
  }

  return res.json()

}

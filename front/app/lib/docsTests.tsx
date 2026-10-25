const API_URL = process.env.NEXT_PUBLIC_BASE_URL  

export interface ReadmeInfo {
  found: boolean;
  path: string | null;
  words: number;
  headings: number;
  code_blocks: number;
  images: number;
  badges: number;
  links: number;
  has_intro: boolean;
  sections: Record<string, boolean>;
}

export interface DocumentationInfo {
  score: number;
  max: number;
  readme: ReadmeInfo;
  files: {
    license: boolean;
    contributing: string | null;
    changelog: string | null;
    code_of_conduct: string | null;
    security: string | null;
  };
  docs_folder: { found: boolean; files: number };
}

export interface TestingInfo {
  score: number;
  max: number;
  test_files: number;
  source_files: number;
  test_ratio: number;
  coverage_estimate: "none" | "low" | "moderate" | "good";
  test_dirs: string[];
  example_tests: string[];
  frameworks: string[];
  has_test_command: boolean;
  coverage_tooling: string[];
  ci: {
    found: boolean;
    files: string[];
    runs_tests: boolean;
    runs_coverage: boolean;
  };
}

export interface ScoreItem {
  score: number;
  max: number;
}

export interface DocsTestsResult {
  repo: string;
  documentation: DocumentationInfo;
  testing: TestingInfo;
  score: {
    overall: number;
    grade: string;
    breakdown: Record<string, ScoreItem>;
  };
  recommendations: string[];
  coverage_note: string;
  truncated: boolean;
}

export async function fetchDocsTests(
  owner: string,
  repo: string
): Promise<DocsTestsResult> {
  const res = await fetch(
    `${API_URL}/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/docs-tests`
  );

  if (!res.ok) {
    let message = `Documentation & tests analysis failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch {
      // no JSON body 
    }
    throw new Error(message);
  }

  return res.json();
}
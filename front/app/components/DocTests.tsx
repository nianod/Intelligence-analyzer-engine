"use client";

import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, XCircle } from "lucide-react";
import type { DocsTestsResult } from "../lib/docsTests";

interface Props {
  data: DocsTestsResult | null;
  loading: boolean;
  error: string | null;
}

const BREAKDOWN_LABELS: Record<string, string> = {
  readme: "README quality",
  project_docs: "Project docs",
  test_presence: "Test files",
  test_ratio: "Test-to-source ratio",
  frameworks: "Test framework",
  test_command: "Test command",
  ci: "Tests in CI",
  coverage_tooling: "Coverage tooling",
};

const SECTION_LABELS: Record<string, string> = {
  installation: "Installation",
  usage: "Usage",
  features: "Features / overview",
  configuration: "Configuration",
  api: "API / reference",
  testing: "Testing",
  contributing: "Contributing",
  license: "License",
};

const COVERAGE_STYLES: Record<string, string> = {
  none: "bg-red-50 text-red-700 border-red-200",
  low: "bg-orange-50 text-orange-700 border-orange-200",
  moderate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  good: "bg-green-50 text-green-700 border-green-200",
};

function gradeColor(grade: string) {
  switch (grade) {
    case "A":
      return "text-green-600 bg-green-50 border-green-200";
    case "B":
      return "text-lime-600 bg-lime-50 border-lime-200";
    case "C":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "D":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-red-600 bg-red-50 border-red-200";
  }
}

function barColor(pct: number) {
  if (pct >= 75) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function Check({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
      )}
      <span className={ok ? "text-gray-700" : "text-gray-400"}>
        {label}
        {detail && ok && <span className="ml-1 text-xs text-gray-400">({detail})</span>}
      </span>
    </li>
  );
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${barColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DocsTests({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing documentation and tests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return null;

  const { documentation: docs, testing, score, recommendations, truncated } = data;
  const readme = docs.readme;

  return (
    <div className="space-y-6 py-2">
      {/* Overall */}
      <div className="flex items-center justify-between gap-4">
        <div className="grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">Documentation</p>
            <p className="text-xl font-semibold text-gray-900">
              {docs.score}
              <span className="text-sm font-medium text-gray-400">/{docs.max}</span>
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">Testing</p>
            <p className="text-xl font-semibold text-gray-900">
              {testing.score}
              <span className="text-sm font-medium text-gray-400">/{testing.max}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Overall</p>
            <p className="text-2xl font-bold text-gray-900">
              {score.overall}
              <span className="text-sm font-medium text-gray-400">/100</span>
            </p>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border text-xl font-bold ${gradeColor(
              score.grade
            )}`}
          >
            {score.grade}
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-800">Documentation</h4>

        {!readme.found ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            No README found.
          </p>
        ) : (
          <>
            <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Words", value: readme.words },
                { label: "Headings", value: readme.headings },
                { label: "Code blocks", value: readme.code_blocks },
                { label: "Images / badges", value: readme.images + readme.badges },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500">{m.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              README sections
            </p>
            <ul className="mb-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
              <Check ok={readme.has_intro} label="Introduction" />
              {Object.entries(readme.sections).map(([key, ok]) => (
                <Check key={key} ok={ok} label={SECTION_LABELS[key] ?? key} />
              ))}
            </ul>
          </>
        )}

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Project files
        </p>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <Check ok={docs.files.license} label="LICENSE" />
          <Check ok={!!docs.files.contributing} label="CONTRIBUTING" detail={docs.files.contributing ?? undefined} />
          <Check ok={!!docs.files.security} label="SECURITY" detail={docs.files.security ?? undefined} />
          <Check ok={!!docs.files.changelog} label="CHANGELOG" detail={docs.files.changelog ?? undefined} />
          <Check ok={!!docs.files.code_of_conduct} label="CODE OF CONDUCT" detail={docs.files.code_of_conduct ?? undefined} />
          <Check
            ok={docs.docs_folder.found}
            label="docs/ folder"
            detail={`${docs.docs_folder.files} files`}
          />
        </ul>
      </div>

      {/* Testing */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-800">Testing</h4>

        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Test files", value: testing.test_files },
            { label: "Source files", value: testing.source_files },
            { label: "Test ratio", value: `${Math.round(testing.test_ratio * 100)}%` },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs text-gray-500">{m.label}</p>
              <p className="text-lg font-semibold text-gray-900">{m.value}</p>
            </div>
          ))}
          <div
            className={`rounded-lg border p-3 ${COVERAGE_STYLES[testing.coverage_estimate] ?? COVERAGE_STYLES.none}`}
          >
            <p className="text-xs opacity-80">Est. coverage</p>
            <p className="text-lg font-semibold capitalize">{testing.coverage_estimate}</p>
          </div>
        </div>
        <p className="mb-4 text-xs text-gray-400">{data.coverage_note}</p>

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Frameworks
        </p>
        {testing.frameworks.length === 0 ? (
          <p className="mb-4 text-sm text-gray-500">No test framework detected.</p>
        ) : (
          <div className="mb-4 flex flex-wrap gap-2">
            {testing.frameworks.map((f) => (
              <span
                key={f}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <Check ok={testing.has_test_command} label="Runnable test command" />
          <Check ok={testing.ci.found} label="CI configured" />
          <Check ok={testing.ci.runs_tests} label="Tests run in CI" />
          <Check
            ok={testing.coverage_tooling.length > 0}
            label="Coverage tooling"
            detail={testing.coverage_tooling.join(", ")}
          />
        </ul>

        {testing.example_tests.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Example tests found
            </p>
            <ul className="space-y-1">
              {testing.example_tests.map((t) => (
                <li key={t} className="truncate font-mono text-xs text-gray-600">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div>
        <p className="mb-3 text-sm font-medium text-gray-700">Score breakdown</p>
        <div className="space-y-3">
          {Object.entries(score.breakdown).map(([key, item]) => (
            <ScoreBar key={key} label={BREAKDOWN_LABELS[key] ?? key} score={item.score} max={item.max} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-800">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
            {recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {truncated && (
        <p className="text-xs text-gray-400">
          This repository is very large, so GitHub returned a partial file tree. Results are approximate.
        </p>
      )}
    </div>
  );
}
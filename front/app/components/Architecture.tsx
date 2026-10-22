"use client";

import { AlertTriangle, CheckCircle2, Lightbulb, Loader2 } from "lucide-react";
import type { ArchitectureResult } from "../lib/archtecture";

interface Props {
  data: ArchitectureResult | null;
  loading: boolean;
  error: string | null;
}

const BREAKDOWN_LABELS: Record<string, string> = {
  separation_of_concerns: "Separation of concerns",
  organization: "Organization",
  conventions: "Conventions",
  balance: "Balance & modularity",
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

export default function Architecture({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing architecture...
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

  const { architecture, patterns, metrics, score, recommendations, truncated } = data;

  return (
    <div className="space-y-6 py-2">
      {/* Type + overall score */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Architecture type
          </p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900">
            {architecture.type}
          </h3>
          <p className="text-sm text-gray-500">
            {architecture.confidence}% confidence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Structure score
            </p>
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

      {/* Signals */}
      {architecture.signals.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Detected signals</p>
          <ul className="space-y-1">
            {architecture.signals.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Patterns */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Layout patterns</p>
        {patterns.length === 0 ? (
          <p className="text-sm text-gray-500">No recognizable layout pattern detected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {patterns.map((p) => (
              <span
                key={p.name}
                title={p.evidence.join(", ")}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Score breakdown */}
      <div>
        <p className="mb-3 text-sm font-medium text-gray-700">Score breakdown</p>
        <div className="space-y-3">
          {Object.entries(score.breakdown).map(([key, item]) => {
            const pct = Math.round((item.score / item.max) * 100);
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-xs text-gray-600">
                  <span>{BREAKDOWN_LABELS[key] ?? key}</span>
                  <span>
                    {item.score}/{item.max}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${barColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Files", value: metrics.total_files },
          { label: "Directories", value: metrics.total_directories },
          { label: "Max depth", value: metrics.max_depth },
          { label: "Root files", value: metrics.root_files },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className="text-lg font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Top-level folders */}
      {metrics.top_level_dirs.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">
            Where the code lives
          </p>
          <div className="space-y-2">
            {metrics.top_level_dirs.map((d) => (
              <div key={d.name} className="flex items-center gap-3 text-xs">
                <span className="w-28 shrink-0 truncate font-mono text-gray-700">
                  {d.name}/
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.max(d.share * 100, 2)}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-gray-500">
                  {d.files} files
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
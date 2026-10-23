"use client";

import { useCallback, useState } from "react";
import { fetchDocsTests, DocsTestsResult } from "../lib/docsTests"

export function useDocsTests() {
  const [data, setData] = useState<DocsTestsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (owner: string, repo: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchDocsTests(owner, repo);
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyze };
}
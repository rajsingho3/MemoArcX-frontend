import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BackendUrl } from "../config";

// Simple content shape; refine as backend contracts stabilize
export type ContentItem = {
  id?: string;
  _id?: string;
  title?: string;
  link: string;
  type: "twitter" | "youtube" | "document" | "link";
};

// React hook to load and manage content list
export function useContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || undefined;
      const res = await axios.get(`${BackendUrl}/content/view`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setContent(res.data?.content ?? []);
    } catch (e: any) {
      // Basic error capture; keep quiet in UI unless needed
      setError(e?.response?.data?.message || e?.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, setContent, loading, error, refetch: fetchContent };
}
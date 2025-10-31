"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserHistory({ user_uuid }: { user_uuid?: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/projects?user_uuid=${user_uuid}`);
        const data = await res.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [user_uuid]);

  return (
    <div className="overflow-hidden w-full bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-100 bg-gradient-to-br from-blue-100 to-purple-100/80 border-r p-4 flex flex-col fixed top-0 left-0 bottom-0 rounded-r-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-5">Your Project History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No previous projects found.</p>
        ) : (
          <ScrollArea className="h-[100dvh] w-full">
            <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
              {projects.length > 0
                ? Array.from({ length: 20 }, (_, i) => projects[0]).map((proj, idx) => (
                    <li key={idx} className="p-2 bg-white rounded-md shadow-sm">
                      <p className="text-sm truncate">{proj.user_prompt || "Untitled Project"}</p>
                      <Link
                        href={proj.signed_url}
                        className="text-blue-500 text-xs underline"
                        target="_blank"
                      >
                        Download ZIP
                      </Link>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(proj.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))
                : null}
            </ul>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
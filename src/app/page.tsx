"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import PostGrid from "@/components/PostGrid";

interface Post {
  id: string;
  name: string;
  caption: string;
  date: string;
  image: string;
  type: string;
}

interface Profile {
  name: string;
  image: string;
  bio: string;
  postsCount: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notion")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.posts);
          setProfile(data.profile);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ig-secondary)] text-sm">Loading...</div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-xl font-semibold mb-2">Configuration Required</h1>
          <p className="text-[var(--ig-secondary)]">
            Set NOTION_TOKEN and NOTION_DATABASE_ID in your environment variables.
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-12">
      {/* Instagram-style top bar */}
      <nav className="bg-white border-b border-[var(--ig-border)] sticky top-0 z-40">
        <div className="max-w-[935px] mx-auto flex items-center justify-between h-14 px-4">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "cursive" }}>
            InstaGrid
          </h2>
          <div className="flex items-center gap-4 text-[var(--ig-secondary)] text-sm">
            Powered by Notion
          </div>
        </div>
      </nav>

      <ProfileHeader
        name={profile.name}
        image={profile.image}
        bio={profile.bio}
        postsCount={profile.postsCount}
      />

      <PostGrid posts={posts} />
    </main>
  );
}

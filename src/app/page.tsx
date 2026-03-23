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
  followers: string;
  following: string;
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
      <main className="min-h-screen bg-[#fafafa]">
        <nav className="bg-white border-b border-[var(--ig-border)] sticky top-0 z-40">
          <div className="max-w-[935px] mx-auto flex items-center justify-between h-14 px-4">
            <span className="text-2xl font-semibold" style={{ fontFamily: "'Dancing Script', cursive" }}>InstaGrid</span>
          </div>
        </nav>
        <div className="max-w-[935px] mx-auto px-4 py-10 animate-pulse">
          <div className="flex gap-8 mb-8">
            <div className="w-[150px] h-[150px] rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-4 py-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold mb-2">Configuration Required</h1>
          <p className="text-[var(--ig-secondary)] text-sm mb-3">
            Set <code className="bg-gray-100 px-1 rounded">NOTION_TOKEN</code> and{" "}
            <code className="bg-gray-100 px-1 rounded">NOTION_DATABASE_ID</code> in your environment variables.
          </p>
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-16">
      {/* Instagram-style top bar */}
      <nav className="bg-white border-b border-[var(--ig-border)] sticky top-0 z-40">
        <div className="max-w-[935px] mx-auto flex items-center justify-between h-[60px] px-4">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
            InstaGrid
          </h2>
          <div className="flex items-center gap-5 text-[var(--ig-secondary)]">
            <svg className="w-6 h-6 hover:text-[var(--ig-text)] cursor-pointer transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <svg className="w-6 h-6 hover:text-[var(--ig-text)] cursor-pointer transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
        </div>
      </nav>

      <ProfileHeader
        name={profile.name}
        image={profile.image}
        bio={profile.bio}
        postsCount={profile.postsCount}
        followers={profile.followers}
        following={profile.following}
      />

      <PostGrid posts={posts} profileImage={profile.image} profileName={profile.name} />
    </main>
  );
}

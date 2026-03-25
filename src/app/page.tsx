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
  const [dark, setDark] = useState(false);

  /* Sync dark mode with localStorage + html class */
  useEffect(() => {
    const stored = localStorage.getItem("ig-dark");
    if (stored === "true") setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("ig-dark", String(dark));
  }, [dark]);

  useEffect(() => {
    fetch("/api/notion")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setPosts(data.posts);
          setProfile(data.profile);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--ig-bg)]">
        <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} />
        <div className="max-w-[935px] mx-auto px-4 py-10">
          <div className="flex gap-10 mb-10">
            <div className="w-[150px] h-[150px] rounded-full skeleton shrink-0" />
            <div className="flex-1 space-y-4 py-3">
              <div className="h-5 skeleton rounded w-1/3" />
              <div className="flex gap-6">
                <div className="h-4 skeleton rounded w-16" />
                <div className="h-4 skeleton rounded w-16" />
                <div className="h-4 skeleton rounded w-16" />
              </div>
              <div className="h-4 skeleton rounded w-1/2" />
              <div className="h-4 skeleton rounded w-2/5" />
            </div>
          </div>
          <div className="flex gap-6 pb-5 border-t border-[var(--ig-border)] pt-6 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-full skeleton" />
                <div className="h-3 w-12 skeleton rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[3px] mt-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "4/5" }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--ig-bg)]">
        <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full border-2 border-[var(--ig-border)] flex items-center justify-center bg-[var(--ig-surface)]">
              <svg className="w-9 h-9 text-[var(--ig-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold mb-2 text-[var(--ig-text)]">Configuration Required</h1>
            <p className="text-[var(--ig-text-secondary)] text-sm mb-4 leading-relaxed">
              Set <code className="bg-[var(--ig-btn-secondary)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--ig-text)]">NOTION_TOKEN</code> and{" "}
              <code className="bg-[var(--ig-btn-secondary)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--ig-text)]">NOTION_DATABASE_ID</code>{" "}
              in your environment variables.
            </p>
            {error && (
              <p className="text-[var(--ig-error)] text-sm bg-red-950/20 p-3 rounded-xl border border-red-900/30">{error}</p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ig-bg)] pb-20">
      <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} profileImage={profile.image} />
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

/* ─── Navbar ─────────────────────────────────────────────────────────────── */

function Navbar({
  dark,
  onToggleDark,
  profileImage,
}: {
  dark: boolean;
  onToggleDark: () => void;
  profileImage?: string;
}) {
  return (
    <nav
      className="border-b border-[var(--ig-border)] sticky top-0 z-40"
      style={{
        backgroundColor: dark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[975px] mx-auto flex items-center justify-between h-[60px] px-5">
        {/* Logo */}
        <span
          className="text-[26px] text-[var(--ig-text)] select-none"
          style={{ fontFamily: "var(--font-logo)", lineHeight: 1 }}
        >
          InstaGrid
        </span>

        {/* Icon row */}
        <div className="flex items-center gap-0.5 text-[var(--ig-text)]">
          <NavBtn label="Home">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" />
            </svg>
          </NavBtn>

          <NavBtn label="Messages">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </NavBtn>

          <NavBtn label="Notifications">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </NavBtn>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={dark ? "Light mode" : "Dark mode"}
            className="p-2.5 rounded-xl hover:bg-[var(--ig-btn-secondary)] transition-colors text-[var(--ig-text)]"
          >
            {dark ? (
              /* Sun icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon icon */
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 12c0 5.385 4.365 9.75 9.75 9.75 4.042 0 7.523-2.457 9.002-6.002Z" />
              </svg>
            )}
          </button>

          {/* Profile avatar */}
          <button className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-offset-1 ring-transparent hover:ring-[var(--ig-border)] transition-all ml-1" title="Profile">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--ig-border)] flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--ig-text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavBtn({
  children,
  label,
  extraClass = "",
}: {
  children: React.ReactNode;
  label: string;
  extraClass?: string;
}) {
  return (
    <button
      title={label}
      className={`p-2.5 rounded-xl hover:bg-[var(--ig-btn-secondary)] transition-colors ${extraClass}`}
    >
      {children}
    </button>
  );
}

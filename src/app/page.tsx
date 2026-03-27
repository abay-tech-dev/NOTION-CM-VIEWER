"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

/* ─── Entry point (Suspense required for useSearchParams) ─────────────────── */

export default function Home() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <HomeContent />
    </Suspense>
  );
}

/* ─── Main content ────────────────────────────────────────────────────────── */

function HomeContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const db = params.get("db") ?? "";
  const urlName = params.get("name") ?? "";
  const urlBio = params.get("bio") ?? "";
  const urlFollowers = params.get("followers") ?? "";
  const urlFollowing = params.get("following") ?? "";
  const urlAvatar = params.get("avatar") ?? "";

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ig-dark");
    if (stored === "true") setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("ig-dark", String(dark));
  }, [dark]);

  if (!token || !db) {
    return <SetupScreen dark={dark} onToggleDark={() => setDark((d) => !d)} />;
  }

  return (
    <FeedView
      token={token}
      db={db}
      urlName={urlName}
      urlBio={urlBio}
      urlFollowers={urlFollowers}
      urlFollowing={urlFollowing}
      urlAvatar={urlAvatar}
      dark={dark}
      onToggleDark={() => setDark((d) => !d)}
    />
  );
}

/* ─── Feed view (when token + db are present) ─────────────────────────────── */

function FeedView({
  token, db, urlName, urlBio, urlFollowers, urlFollowing, urlAvatar, dark, onToggleDark,
}: {
  token: string; db: string;
  urlName: string; urlBio: string; urlFollowers: string; urlFollowing: string; urlAvatar: string;
  dark: boolean; onToggleDark: () => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      fetch(`/api/notion?token=${encodeURIComponent(token)}&db=${encodeURIComponent(db)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else {
            setPosts(data.posts);
            setPostsCount(data.posts.length);
          }
        })
        .catch(() => setError("Failed to load data"))
        .finally(() => setLoading(false));

    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [token, db]);

  if (loading) return <SkeletonPage dark={dark} onToggleDark={onToggleDark} />;

  if (error) {
    return (
      <main className="min-h-screen flex flex-col bg-[var(--ig-bg)]">
        <Navbar dark={dark} onToggleDark={onToggleDark} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <p className="text-[var(--ig-error)] text-sm bg-red-950/20 p-4 rounded-xl border border-red-900/30">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ig-bg)] pb-20">
      <Navbar dark={dark} onToggleDark={onToggleDark} profileImage={urlAvatar} />
      <ProfileHeader
        name={urlName || "username"}
        image={urlAvatar}
        bio={urlBio}
        postsCount={postsCount}
        followers={urlFollowers || "—"}
        following={urlFollowing || "—"}
      />
      <PostGrid posts={posts} profileImage={urlAvatar} profileName={urlName || "username"} />
    </main>
  );
}

/* ─── Setup screen ────────────────────────────────────────────────────────── */

function SetupScreen({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [token, setToken] = useState("");
  const [db, setDb] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");
  const [avatar, setAvatar] = useState("");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";

  const buildUrl = () => {
    if (!token || !db) return "";
    const p = new URLSearchParams({ token, db });
    if (name) p.set("name", name);
    if (bio) p.set("bio", bio);
    if (followers) p.set("followers", followers);
    if (following) p.set("following", following);
    if (avatar) p.set("avatar", avatar);
    return `${baseUrl}?${p.toString()}`;
  };

  const generatedUrl = buildUrl();

  const copy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--ig-bg)]">
      <Navbar dark={dark} onToggleDark={onToggleDark} />

      <div className="max-w-[620px] mx-auto px-5 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold text-[var(--ig-text)] mb-2">Configuration</h1>
          <p className="text-[var(--ig-text-secondary)] text-sm leading-relaxed">
            Remplis les champs ci-dessous pour générer ton URL d&apos;embed Notion.
          </p>
        </div>

        {/* Step 1 */}
        <div className="mb-8">
          <StepLabel n={1} title="Créer une intégration Notion" />
          <p className="text-sm text-[var(--ig-text-secondary)] mt-1 mb-3 leading-relaxed">
            Va sur{" "}
            <a
              href="https://www.notion.so/my-integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ig-blue)] hover:underline"
            >
              notion.so/my-integrations
            </a>{" "}
            → <strong className="text-[var(--ig-text)]">New integration</strong> → copie le
            token interne (commence par <code className="bg-[var(--ig-btn-secondary)] px-1 rounded text-xs">secret_</code>).
            <br />
            Ensuite, dans ta database Notion : <strong className="text-[var(--ig-text)]">··· → Add connections</strong> → sélectionne ton intégration.
          </p>
          <Field label="Token Notion" placeholder="secret_xxxxxxxxxxxx" value={token} onChange={setToken} type="password" />
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <StepLabel n={2} title="ID de ta database Notion" />
          <p className="text-sm text-[var(--ig-text-secondary)] mt-1 mb-3 leading-relaxed">
            Ouvre ta database → copie l&apos;ID dans l&apos;URL :{" "}
            <code className="bg-[var(--ig-btn-secondary)] px-1 rounded text-xs">notion.so/&lt;workspace&gt;/<strong>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</strong>?v=…</code>
          </p>
          <Field label="Database ID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={db} onChange={setDb} />
        </div>

        {/* Step 3 — profile */}
        <div className="mb-8">
          <StepLabel n={3} title="Infos du profil (optionnel)" />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Nom / @username" placeholder="monbrand" value={name} onChange={setName} />
            <Field label="Abonnés" placeholder="12 400" value={followers} onChange={setFollowers} />
            <Field label="Abonnements" placeholder="350" value={following} onChange={setFollowing} />
            <Field label="URL photo de profil" placeholder="https://..." value={avatar} onChange={setAvatar} />
          </div>
          <div className="mt-3">
            <Field label="Bio" placeholder="✨ Créateur de contenu | Paris" value={bio} onChange={setBio} />
          </div>
        </div>

        {/* Generated URL */}
        <div className="mb-6">
          <StepLabel n={4} title="Ton URL d'embed" />
          <div className="mt-3 rounded-xl border border-[var(--ig-border)] bg-[var(--ig-surface)] overflow-hidden">
            <div className="p-3 min-h-[52px] font-mono text-xs text-[var(--ig-text-secondary)] break-all leading-relaxed">
              {generatedUrl || (
                <span className="italic opacity-50">Remplis le token et l&apos;ID de la database…</span>
              )}
            </div>
            <div className="flex border-t border-[var(--ig-border)]">
              <button
                onClick={copy}
                disabled={!generatedUrl}
                className="flex-1 py-2.5 text-sm font-semibold text-[var(--ig-blue)] hover:bg-[var(--ig-btn-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {copied ? "✓ Copié !" : "Copier l'URL"}
              </button>
              {generatedUrl && (
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-sm font-semibold text-center text-[var(--ig-text)] hover:bg-[var(--ig-btn-secondary)] transition-colors border-l border-[var(--ig-border)]"
                >
                  Ouvrir le preview →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Notion embed tip */}
        <div className="rounded-xl bg-[var(--ig-btn-secondary)] px-4 py-4 text-sm text-[var(--ig-text-secondary)] leading-relaxed">
          <p className="font-semibold text-[var(--ig-text)] mb-1">Comment l&apos;ajouter dans Notion ?</p>
          Dans ta page Notion, tape <code className="bg-[var(--ig-surface)] px-1 rounded text-xs">/embed</code> →
          colle l&apos;URL générée → clique sur <strong className="text-[var(--ig-text)]">Embed link</strong>.
        </div>
      </div>
    </main>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-6 h-6 rounded-full bg-[var(--ig-blue)] text-white text-xs font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="font-semibold text-[var(--ig-text)]">{title}</span>
    </div>
  );
}

function Field({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--ig-text-secondary)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--ig-input-bg)] border border-[var(--ig-border)] rounded-xl px-3 py-2 text-sm text-[var(--ig-text)] placeholder:text-[var(--ig-text-secondary)] outline-none focus:border-[var(--ig-blue)] transition-colors"
      />
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */

function SkeletonPage({ dark, onToggleDark }: { dark?: boolean; onToggleDark?: () => void }) {
  return (
    <main className="min-h-screen bg-[var(--ig-bg)]">
      <Navbar dark={dark ?? false} onToggleDark={onToggleDark ?? (() => {})} />
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
        <div className="border-t border-[var(--ig-border)] mb-1" />
        <div className="grid grid-cols-3 gap-[3px] mt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: "4/5" }} />
          ))}
        </div>
      </div>
    </main>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */

function Navbar({ dark, onToggleDark, profileImage }: {
  dark: boolean; onToggleDark: () => void; profileImage?: string;
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
        <span
          className="text-[26px] text-[var(--ig-text)] select-none"
          style={{ fontFamily: "var(--font-logo)", lineHeight: 1 }}
        >
          InstaFeedViewer
        </span>

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

          <button
            onClick={onToggleDark}
            title={dark ? "Light mode" : "Dark mode"}
            className="p-2.5 rounded-xl hover:bg-[var(--ig-btn-secondary)] transition-colors text-[var(--ig-text)]"
          >
            {dark ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 12c0 5.385 4.365 9.75 9.75 9.75 4.042 0 7.523-2.457 9.002-6.002Z" />
              </svg>
            )}
          </button>

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

function NavBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button title={label} className="p-2.5 rounded-xl hover:bg-[var(--ig-btn-secondary)] transition-colors">
      {children}
    </button>
  );
}

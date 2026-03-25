"use client";

import { useState } from "react";

interface Post {
  id: string;
  name: string;
  caption: string;
  date: string;
  image: string;
  type: string;
}

interface PostGridProps {
  posts: Post[];
  profileImage?: string;
  profileName?: string;
}

export default function PostGrid({ posts, profileImage, profileName }: PostGridProps) {
  const [selected, setSelected] = useState<Post | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Sort by date descending (most recent first), like Instagram
  const sortedPosts = [...posts].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="max-w-[935px] mx-auto">
        {/* Separator */}
        <div className="border-t border-[var(--ig-border)]" />

        {/* Grid */}
        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--ig-text-secondary)]">
            <div className="w-20 h-20 mb-5 rounded-full border-2 border-[var(--ig-border)] flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-[var(--ig-text)] mb-2">No Posts Yet</p>
            <p className="text-sm">When you share photos, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[3px]">
            {sortedPosts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onOpen={(p) => setSelected(p)}
                isLiked={liked.has(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 p-2"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="bg-[var(--ig-surface-raised)] w-full max-w-[935px] max-h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-none md:rounded-xl"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="md:w-[55%] bg-black flex items-center justify-center shrink-0" style={{ minHeight: 240 }}>
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-contain max-h-[90vh]"
                  style={{ aspectRatio: "4/5" }}
                />
              ) : (
                <div className="text-[var(--ig-text-secondary)] p-12 text-sm">No image</div>
              )}
            </div>

            {/* Right panel */}
            <div className="md:w-[45%] flex flex-col min-h-0 border-l border-[var(--ig-border)]">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--ig-border)] shrink-0">
                <Avatar src={profileImage} alt={profileName} size={32} />
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] leading-tight text-[var(--ig-text)]">{profileName || "user"}</span>
                  {selected.name && selected.name !== profileName && (
                    <span className="text-[var(--ig-text-secondary)] text-[12px]">{selected.name}</span>
                  )}
                </div>
                <button className="ml-auto p-1 text-[var(--ig-text)] hover:text-[var(--ig-text-secondary)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
                {selected.caption && (
                  <div className="flex gap-3">
                    <Avatar src={profileImage} alt={profileName} size={32} />
                    <div className="text-[14px] leading-relaxed">
                      <span className="font-semibold text-[var(--ig-text)] mr-2">{profileName || "user"}</span>
                      <span className="text-[var(--ig-text)]">{renderCaption(selected.caption)}</span>
                      <p className="text-[var(--ig-text-secondary)] text-[12px] mt-1.5">
                        {selected.date ? timeAgo(selected.date) : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--ig-border)] shrink-0">
                <div className="flex items-center px-4 pt-3 pb-1 gap-2">
                  <button
                    onClick={() => toggleLike(selected.id)}
                    className="p-1 -m-1 transition-transform active:scale-90"
                  >
                    {liked.has(selected.id) ? (
                      <svg className="w-7 h-7 text-[var(--ig-error)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 text-[var(--ig-text)]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    )}
                  </button>
                  <button className="p-1 -m-1 hover:opacity-60 text-[var(--ig-text)]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                  </button>
                  <button className="p-1 -m-1 hover:opacity-60 text-[var(--ig-text)]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </button>
                  <button className="ml-auto p-1 -m-1 hover:opacity-60 text-[var(--ig-text)]">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  </button>
                </div>
                <div className="px-4 pt-1 pb-0.5">
                  <p className="text-[14px] font-semibold text-[var(--ig-text)]">
                    {liked.has(selected.id) ? "1 like" : "Be the first to like this"}
                  </p>
                </div>
                <div className="px-4 pb-3">
                  <time className="text-[11px] text-[var(--ig-text-secondary)] uppercase tracking-wider">
                    {selected.date
                      ? new Date(selected.date).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        })
                      : ""}
                  </time>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 border-t border-[var(--ig-border)]">
                  <button className="text-[var(--ig-text-secondary)] hover:text-[var(--ig-text)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Add a comment…"
                    className="flex-1 text-[14px] outline-none placeholder:text-[var(--ig-text-secondary)] bg-transparent text-[var(--ig-text)]"
                  />
                  <button className="text-[var(--ig-blue)] text-[14px] font-semibold opacity-40 cursor-default" disabled>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Post tile ───────────────────────────────────────────────────────────── */

function PostItem({
  post,
  onOpen,
  isLiked,
}: {
  post: Post;
  onOpen: (p: Post) => void;
  isLiked: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden bg-[var(--ig-btn-secondary)] group cursor-pointer"
      style={{ aspectRatio: "4/5" }}
      onClick={() => onOpen(post)}
    >
      {post.image ? (
        <img
          src={post.image}
          alt={post.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--ig-border)]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="flex gap-7 text-white font-bold text-[15px]">
          <span className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
            </svg>
            {isLiked ? "1" : "—"}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            —
          </span>
        </div>
      </div>

      {/* Type badges */}
      {post.type?.toLowerCase() === "reel" && (
        <div className="absolute top-2 right-2 text-white drop-shadow-lg">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      )}
      {post.type?.toLowerCase() === "carousel" && (
        <div className="absolute top-2 right-2 text-white drop-shadow-lg">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M2 6h2v12H2V6zm3 0h2v12H5V6zm14 0h2v12h-2V6zm-3 0h2v12h-2V6zM8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function Avatar({ src, alt, size }: { src?: string; alt?: string; size: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-[var(--ig-btn-secondary)] shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <svg className="w-4 h-4 text-[var(--ig-text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
    </div>
  );
}

function renderCaption(text: string) {
  const parts = text.split(/(#[\w]+|@[\w.]+)/g);
  return parts.map((part, i) =>
    part.startsWith("#") || part.startsWith("@") ? (
      <span key={i} className="text-[var(--ig-blue)] cursor-pointer hover:opacity-80">{part}</span>
    ) : (
      part
    )
  );
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const secs = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

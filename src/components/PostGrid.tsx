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

  return (
    <>
      {/* Grid */}
      <div className="max-w-[935px] mx-auto border-t border-[var(--ig-border)]">
        {/* Tabs */}
        <div className="flex justify-center gap-12 text-xs font-semibold tracking-widest uppercase text-[var(--ig-secondary)]">
          <button className="text-[var(--ig-text)] border-t border-[var(--ig-text)] py-3 -mt-px">
            <span className="flex items-center gap-1.5">
              <GridIcon /> Posts
            </span>
          </button>
          <button className="py-3 -mt-px hover:text-gray-600 transition-colors">
            <span className="flex items-center gap-1.5">
              <ReelsIcon /> Reels
            </span>
          </button>
          <button className="py-3 -mt-px hover:text-gray-600 transition-colors">
            <span className="flex items-center gap-1.5">
              <TagIcon /> Tagged
            </span>
          </button>
        </div>

        {/* Images grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--ig-secondary)]">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xl font-semibold text-[var(--ig-text)] mb-1">Share Photos</p>
            <p className="text-sm">When you share photos, they will appear on your profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[3px]">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelected(post)}
                className="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-6 text-white font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      <HeartIcon /> —
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CommentIcon /> —
                    </span>
                  </div>
                </div>
                {/* Type badge */}
                {post.type && post.type.toLowerCase() === "reel" && (
                  <div className="absolute top-2 right-2 text-white drop-shadow">
                    <ReelsBadgeIcon />
                  </div>
                )}
                {/* Multiple images badge */}
                {post.type && post.type.toLowerCase() === "carousel" && (
                  <div className="absolute top-2 right-2 text-white drop-shadow">
                    <CarouselIcon />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer z-10"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="bg-white max-w-[935px] w-full mx-4 max-h-[90vh] flex flex-col md:flex-row"
            style={{ boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image side */}
            <div className="md:w-[60%] bg-black flex items-center justify-center min-h-[300px]">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-contain max-h-[90vh]"
                />
              ) : (
                <div className="text-gray-500 p-12 text-sm">No image</div>
              )}
            </div>

            {/* Details side */}
            <div className="md:w-[40%] flex flex-col border-l border-[var(--ig-border)] min-h-0">
              {/* Header */}
              <div className="flex items-center gap-3 p-3.5 border-b border-[var(--ig-border)] shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {profileImage ? (
                    <img src={profileImage} alt={profileName} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-full h-full text-gray-400 p-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold text-sm">{profileName || selected.name || "Post"}</span>
                <span className="ml-auto text-[var(--ig-blue)] text-sm font-semibold cursor-pointer">•••</span>
              </div>

              {/* Caption area */}
              <div className="flex-1 p-4 overflow-auto">
                {selected.caption && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt={profileName} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <span className="font-semibold text-sm mr-2">{profileName || "user"}</span>
                      <span className="text-sm whitespace-pre-line">{selected.caption}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions bar */}
              <div className="border-t border-[var(--ig-border)] shrink-0">
                <div className="flex items-center gap-3 p-3">
                  <HeartIcon />
                  <CommentIcon />
                  <ShareIcon />
                  <div className="ml-auto">
                    <SaveIcon />
                  </div>
                </div>
                <div className="px-3 pb-1">
                  <p className="text-xs font-semibold text-[var(--ig-text)]">— likes</p>
                </div>
                <div className="px-3 pb-3">
                  <time className="text-[10px] text-[var(--ig-secondary)] uppercase tracking-wide">
                    {selected.date
                      ? new Date(selected.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GridIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
    </svg>
  );
}

function ReelsIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

function ReelsBadgeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

function CarouselIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 6h2v12H2V6zm3 0h2v12H5V6zm14 0h2v12h-2V6zm-3 0h2v12h-2V6zM8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zm6 12H6v-.7c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.7z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

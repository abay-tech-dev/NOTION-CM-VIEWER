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
}

export default function PostGrid({ posts }: PostGridProps) {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="max-w-[935px] mx-auto border-t border-[var(--ig-border)]">
        {/* Tabs */}
        <div className="flex justify-center gap-12 text-xs font-semibold tracking-wider uppercase text-[var(--ig-secondary)] py-3">
          <button className="text-[var(--ig-text)] border-t border-[var(--ig-text)] pt-3 -mt-3">
            <span className="flex items-center gap-1">
              <GridIcon /> Posts
            </span>
          </button>
          <button className="pt-3 -mt-3 cursor-default">
            <span className="flex items-center gap-1">
              <ReelsIcon /> Reels
            </span>
          </button>
          <button className="pt-3 -mt-3 cursor-default">
            <span className="flex items-center gap-1">
              <TagIcon /> Tagged
            </span>
          </button>
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-3 gap-1">
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
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="flex gap-6 text-white font-semibold text-sm">
                  <span className="flex items-center gap-1">
                    <HeartIcon /> —
                  </span>
                  <span className="flex items-center gap-1">
                    <CommentIcon /> —
                  </span>
                </div>
              </div>
              {/* Type badge */}
              {post.type && post.type.toLowerCase() === "reel" && (
                <div className="absolute top-2 right-2">
                  <ReelsIcon />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row rounded overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image side */}
            <div className="md:w-[60%] bg-black flex items-center justify-center">
              {selected.image ? (
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              ) : (
                <div className="text-gray-500 p-12">No image</div>
              )}
            </div>

            {/* Details side */}
            <div className="md:w-[40%] flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[var(--ig-border)]">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <span className="font-semibold text-sm">{selected.name || "Post"}</span>
              </div>

              {/* Caption */}
              <div className="flex-1 p-4 overflow-auto">
                {selected.caption && (
                  <p className="text-sm whitespace-pre-line">{selected.caption}</p>
                )}
              </div>

              {/* Date */}
              <div className="p-4 border-t border-[var(--ig-border)]">
                <time className="text-xs text-[var(--ig-secondary)] uppercase">
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

            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-white text-2xl font-light cursor-pointer"
            >
              ✕
            </button>
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

function TagIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 3c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zm6 12H6v-.7c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.7z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

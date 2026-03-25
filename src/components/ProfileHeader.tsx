"use client";

interface ProfileHeaderProps {
  name: string;
  image: string;
  bio: string;
  postsCount: number;
  followers?: string;
  following?: string;
}


export default function ProfileHeader({
  name,
  image,
  bio,
  postsCount,
  followers = "—",
  following = "—",
}: ProfileHeaderProps) {
  return (
    <div className="bg-[var(--ig-surface)] border-b border-[var(--ig-border)]">
      <div className="max-w-[935px] mx-auto">
        {/* Main profile row */}
        <header className="flex items-start gap-10 px-4 pt-8 pb-6 md:gap-16">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-[var(--ig-btn-secondary)] ring-1 ring-[var(--ig-border)] flex items-center justify-center">
              {image ? (
                <img src={image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-16 h-16 text-[var(--ig-text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Username + Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-[20px] font-normal tracking-tight text-[var(--ig-text)] truncate">
                {name}
              </h1>
              <div className="flex items-center gap-2">
                <button className="bg-[var(--ig-blue)] text-white text-sm font-semibold px-5 py-[7px] rounded-xl hover:opacity-90 transition-opacity">
                  Follow
                </button>
                <button className="bg-[var(--ig-btn-secondary)] text-[var(--ig-text)] text-sm font-semibold px-4 py-[7px] rounded-xl hover:bg-[var(--ig-btn-secondary-hover)] transition-colors">
                  Message
                </button>
                <button
                  className="bg-[var(--ig-btn-secondary)] text-[var(--ig-text)] px-2.5 py-[7px] rounded-xl hover:bg-[var(--ig-btn-secondary-hover)] transition-colors"
                  title="More options"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="19" r="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-7 mb-4">
              <Stat value={postsCount} label="posts" />
              <Stat value={followers} label="followers" />
              <Stat value={following} label="following" />
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-sm leading-snug whitespace-pre-line font-medium text-[var(--ig-text)] max-w-[380px]">
                {bio}
              </p>
            )}
          </div>
        </header>

      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <span className="font-semibold text-[15px] text-[var(--ig-text)]">{value}</span>{" "}
      <span className="text-[15px] text-[var(--ig-text)]">{label}</span>
    </div>
  );
}

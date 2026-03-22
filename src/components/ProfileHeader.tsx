"use client";

interface ProfileHeaderProps {
  name: string;
  image: string;
  bio: string;
  postsCount: number;
}

export default function ProfileHeader({ name, image, bio, postsCount }: ProfileHeaderProps) {
  return (
    <header className="flex items-center gap-8 px-4 py-8 max-w-[935px] mx-auto">
      {/* Avatar */}
      <div className="shrink-0">
        <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-2 border-[var(--ig-border)] bg-gray-100 flex items-center justify-center">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-xl font-normal">{name}</h1>
          <button className="bg-[var(--ig-blue)] text-white text-sm font-semibold px-6 py-1.5 rounded-lg hover:bg-blue-600 transition">
            Follow
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mb-4">
          <div>
            <span className="font-semibold">{postsCount}</span>{" "}
            <span className="text-[var(--ig-secondary)]">posts</span>
          </div>
          <div>
            <span className="font-semibold">—</span>{" "}
            <span className="text-[var(--ig-secondary)]">followers</span>
          </div>
          <div>
            <span className="font-semibold">—</span>{" "}
            <span className="text-[var(--ig-secondary)]">following</span>
          </div>
        </div>

        {/* Bio */}
        {bio && <p className="text-sm whitespace-pre-line">{bio}</p>}
      </div>
    </header>
  );
}

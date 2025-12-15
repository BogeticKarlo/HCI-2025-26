// components/community/CommunityFeedSkeletonLoadingCard.tsx
"use client";

export function CommunityFeedSkeletonLoadingCard() {
  return (
    <article
      className="
        flex items-center justify-between gap-4
        bg-section-bg 
        rounded-2xl
        px-4 py-3
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        w-full
        max-w-3xl
      "
    >
      {/* Left side: avatar + text */}
      <div className="flex items-start gap-3 flex-1">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-secondary-text animate-pulse" />

        <div className="flex flex-col gap-3 flex-1">
          {/* Username + time */}
          <div className="flex flex-col gap-1">
            <div className="h-5 w-32 bg-secondary-text rounded-md animate-pulse" />
            <div className="h-3 w-20 bg-secondary-text rounded-md animate-pulse animation-delay-75" />
          </div>

          {/* Title */}
          <div className="h-5 w-40 bg-secondary-text rounded-md animate-pulse animation-delay-150" />

          {/* Description */}
          <div className="flex flex-col gap-1">
            <div className="h-3 w-full bg-secondary-text rounded-md animate-pulse animation-delay-200" />
            <div className="h-3 w-[85%] bg-secondary-text rounded-md animate-pulse animation-delay-300" />
          </div>
        </div>
      </div>

      {/* Right side: image + like button */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Image skeleton */}
        <div className="w-24 h-24 rounded-xl bg-secondary-text animate-pulse" />

        {/* Likes skeleton */}
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-secondary-text animate-pulse" />
          <div className="h-3 w-6 bg-secondary-text rounded-md animate-pulse animation-delay-150" />
        </div>
      </div>
    </article>
  );
}

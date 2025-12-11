// RecipeMinimizeCardSkeletonLoader.tsx
"use client";

export function RecipeMinimizeCardSkeletonLoader() {
  return (
    <article className="flex w-[320px] bg-section-bg rounded-2xl shadow-md overflow-hidden h-24">
      {/* Image skeleton */}
      <div className="w-24 h-24 bg-secondary-text animate-pulse" />

      {/* Text skeleton */}
      <div className="flex flex-col px-4 py-3 gap-2 flex-1">
        <div className="h-4 w-24 bg-secondary-text rounded-md animate-pulse" />
        <div className="h-3 w-full bg-secondary-text rounded-md animate-pulse animation-delay-75" />
        <div className="h-3 w-[85%] bg-secondary-text rounded-md animate-pulse animation-delay-150" />
        <div className="h-3 w-[70%] bg-secondary-text rounded-md animate-pulse animation-delay-300" />
      </div>
    </article>
  );
}

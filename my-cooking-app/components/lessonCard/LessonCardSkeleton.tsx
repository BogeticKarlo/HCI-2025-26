export default function LessonCardSkeleton() {
  return (
    <article className="flex flex-col w-[250px] bg-section-bg rounded-2xl shadow-md overflow-hidden h-80">
      <div className="w-full aspect-square bg-secondary-text animate-pulse" />

      <div className="flex flex-1 flex-col gap-3 items-center justify-center">
        <div className="h-4 w-2/3 bg-secondary-text rounded-md animate-pulse" />
        <div className="h-4 w-2/3 bg-secondary-text rounded-md animate-pulse" />
      </div>
    </article>
  );
}

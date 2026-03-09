import { clsx } from "clsx";

export default function SingleLessonSkeleton() {
  const pulse = "animate-pulse bg-secondary-text/40";

  return (
    <article className="w-full max-w-[400px] mx-auto bg-section-bg rounded-3xl p-8 shadow-md flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={clsx("w-10 h-10 rounded-full", pulse)} />
        <div
          className={clsx(
            "h-7 w-40 rounded-md",
            pulse,
            "[animation-delay:120ms]",
          )}
        />
      </div>

      {/* Description */}
      <div
        className={clsx(
          "h-4 w-full rounded-md",
          pulse,
          "[animation-delay:180ms]",
        )}
      />
      <div
        className={clsx(
          "h-4 w-3/4 rounded-md",
          pulse,
          "[animation-delay:260ms]",
        )}
      />

      {/* Video */}
      <div
        className={clsx(
          "w-full h-40 rounded-xl",
          pulse,
          "[animation-delay:350ms]",
        )}
      />
    </article>
  );
}

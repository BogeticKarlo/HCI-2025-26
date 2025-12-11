import { clsx } from "clsx";

export function RecipeCardSkeleton() {
  const pulse = "animate-pulse bg-secondary-text/40";

  return (
    <article className="w-[360px] bg-section-bg rounded-3xl p-8 shadow-md flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={clsx("w-10 h-10 rounded-full", pulse)} />
        <div
          className={clsx(
            "h-7 w-40 rounded-md",
            pulse,
            "[animation-delay:120ms]"
          )}
        />
      </div>

      {/* Description */}
      <div
        className={clsx(
          "h-4 w-full rounded-md",
          pulse,
          "[animation-delay:180ms]"
        )}
      />
      <div
        className={clsx(
          "h-4 w-3/4 rounded-md",
          pulse,
          "[animation-delay:260ms]"
        )}
      />

      {/* Ingredients */}
      <section className="flex justify-between items-start">
        <div className="flex flex-col gap-2 w-1/2">
          <div
            className={clsx(
              "h-5 w-28 rounded-md",
              pulse,
              "[animation-delay:200ms]"
            )}
          />

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-3 w-24 rounded-md",
                pulse,
                `[animation-delay:${300 + i * 60}ms]`
              )}
            />
          ))}
        </div>

        <div
          className={clsx(
            "w-24 h-20 rounded-xl",
            pulse,
            "[animation-delay:250ms]"
          )}
        />
      </section>

      {/* Instructions */}
      <section className="flex justify-between items-start">
        <div className="flex flex-col gap-2 w-1/2">
          <div
            className={clsx(
              "h-5 w-32 rounded-md",
              pulse,
              "[animation-delay:230ms]"
            )}
          />

          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-3 w-24 rounded-md",
                pulse,
                `[animation-delay:${330 + i * 60}ms]`
              )}
            />
          ))}
        </div>

        <div
          className={clsx(
            "w-24 h-20 rounded-xl",
            pulse,
            "[animation-delay:300ms]"
          )}
        />
      </section>

      {/* Video */}
      <div
        className={clsx(
          "w-full h-40 rounded-xl",
          pulse,
          "[animation-delay:350ms]"
        )}
      />

      {/* Footer */}
      <footer className="flex justify-between items-center">
        <div
          className={clsx(
            "h-4 w-20 rounded-md",
            pulse,
            "[animation-delay:400ms]"
          )}
        />

        <div className="flex gap-4">
          <div
            className={clsx(
              "h-4 w-10 rounded-md",
              pulse,
              "[animation-delay:440ms]"
            )}
          />
          <div
            className={clsx(
              "h-4 w-10 rounded-md",
              pulse,
              "[animation-delay:480ms]"
            )}
          />
        </div>
      </footer>
    </article>
  );
}

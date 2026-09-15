export default function Loading() {
  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse"
          />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </main>
  );
}

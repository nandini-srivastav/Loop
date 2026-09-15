export default function Loading() {
  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
      <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mb-2 animate-pulse" />
      <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-4 animate-pulse" />
      <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded mb-2 animate-pulse" />
      <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
      <div className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded mb-6 animate-pulse" />
    </main>
  );
}

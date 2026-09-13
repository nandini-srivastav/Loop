import Link from "next/link";

export default function SubmitSuccess() {
  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold mb-2">Submitted</h1>
      <p className="text-neutral-500 mb-6">
        Your event is pending review and will appear in the feed once approved.
      </p>
      <Link href="/" className="text-sm underline">
        Back to feed
      </Link>
    </main>
  );
}

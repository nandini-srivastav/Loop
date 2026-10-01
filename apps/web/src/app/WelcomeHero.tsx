import Link from "next/link";

export default function WelcomeHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 bg-white border border-neutral-200">
      <div className="grid md:grid-cols-2 items-center">
        <div className="p-8 md:p-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wide text-white rounded-full px-3 py-1 mb-4" style={{ backgroundColor: "#FF5C7A" }}>
            Welcome to Loop
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Every UQ event.<br />One place.
          </h1>
          <p className="text-neutral-500 mb-6">
            Society nights, career fairs, cultural festivals, and everything in between —
            stop finding out about it after it happened.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full px-6 py-3 text-sm font-semibold btn-gradient btn-press shadow-lg"
          >
            Get started
          </Link>
        </div>

        <div className="p-8 flex items-center justify-center">
          <svg viewBox="0 0 320 260" className="w-full max-w-xs" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="130" r="110" fill="#FFF0E9" />
            <circle cx="230" cy="70" r="10" fill="#FFC24B" />
            <circle cx="70" cy="60" r="6" fill="#35D6A8" />
            <circle cx="260" cy="180" r="7" fill="#B78CFF" />

            <rect x="120" y="70" width="80" height="90" rx="14" fill="#FF5C7A" />
            <rect x="132" y="60" width="10" height="20" rx="4" fill="#FF5C7A" />
            <rect x="178" y="60" width="10" height="20" rx="4" fill="#FF5C7A" />
            <rect x="120" y="98" width="80" height="8" fill="#fff" opacity="0.6" />
            <circle cx="140" cy="130" r="6" fill="#fff" opacity="0.9" />
            <circle cx="160" cy="130" r="6" fill="#fff" opacity="0.9" />
            <circle cx="180" cy="130" r="6" fill="#fff" opacity="0.9" />
            <circle cx="140" cy="146" r="6" fill="#fff" opacity="0.6" />
            <circle cx="160" cy="146" r="6" fill="#fff" opacity="0.6" />

            <circle cx="90" cy="190" r="22" fill="#6EC1FF" />
            <circle cx="90" cy="182" r="9" fill="#fff" />
            <path d="M70 205 Q90 185 110 205" fill="#fff" />

            <circle cx="230" cy="200" r="22" fill="#35D6A8" />
            <circle cx="230" cy="192" r="9" fill="#fff" />
            <path d="M210 215 Q230 195 250 215" fill="#fff" />

            <circle cx="160" cy="215" r="22" fill="#FFC24B" />
            <circle cx="160" cy="207" r="9" fill="#fff" />
            <path d="M140 230 Q160 210 180 230" fill="#fff" />

            <path d="M160 40 l4 10 10 2 -8 7 2 10 -8 -6 -8 6 2 -10 -8 -7 10 -2 z" fill="#B78CFF" />
          </svg>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-[#0a0b0d] px-4 py-10 text-white antialiased font-sans">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-2xl flex items-center justify-between py-2 border-b border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-white p-0.5 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Cleanergy Logo"
              width={20}
              height={20}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-bold tracking-tight text-zinc-200">
            Cleanergy Battery
          </span>
        </div>
        <nav className="flex items-center gap-4 text-zinc-400">
          <Link
            href="/privacy"
            className="hover:text-emerald-400 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-emerald-400 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/support"
            className="hover:text-emerald-400 transition-colors"
          >
            Support
          </Link>
        </nav>
      </header>

      {/* Main Hero Card */}
      <main className="flex w-full max-w-lg flex-col items-center justify-center text-center my-auto py-8">
        {/* Glowing Logo Squircle */}
        <div className="relative mb-6">
          <div
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-2xl bg-emerald-500/25 blur-xl"
          />
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-zinc-200/20 bg-white p-2.5 shadow-xl">
            <Image
              src="/logo.png"
              alt="Cleanergy Logo"
              width={70}
              height={70}
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          STATUS: ACTIVE
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Cleanergy MCP Server
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Official Model Context Protocol endpoint for Cleanergy Battery. Enables
          ChatGPT and MCP clients to query LiFePO4 &amp; Sodium-Ion battery catalogs,
          manage carts, and initiate secure Stripe checkouts.
        </p>

        {/* Key-Value Specs Card */}
        <div className="mt-8 w-full max-w-md rounded-2xl border border-zinc-800/80 bg-[#121316]/90 p-5 shadow-2xl backdrop-blur-sm sm:p-6 text-left">
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">Service:</span>
              <span className="font-semibold text-zinc-200">
                Cleanergy Battery Catalog &amp; Checkout
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">MCP Endpoint:</span>
              <span className="font-mono font-medium text-[#00df8f]">/mcp</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">Checkout Session:</span>
              <span className="font-mono font-medium text-[#00df8f]">/checkout</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-500">Official Store:</span>
              <a
                href="https://cleanergybattery.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 hover:text-emerald-300 underline"
              >
                cleanergybattery.com
              </a>
            </div>
          </div>
        </div>

        {/* Public Legal & Support Links Button Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <Link
            href="/privacy"
            className="flex-1 min-w-[120px] rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:border-emerald-500/50 hover:text-white transition-all shadow-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="flex-1 min-w-[120px] rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:border-emerald-500/50 hover:text-white transition-all shadow-sm"
          >
            Terms of Service
          </Link>
          <Link
            href="/support"
            className="flex-1 min-w-[120px] rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 hover:border-emerald-500/50 hover:text-white transition-all shadow-sm"
          >
            Customer Support
          </Link>
        </div>
      </main>

      {/* Muted Footer Copyright with Links */}
      <footer className="w-full max-w-2xl pt-6 border-t border-zinc-800/60 text-center text-xs text-zinc-500">
        <div className="flex flex-wrap justify-center gap-5 mb-3">
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms of Service
          </Link>
          <span>&bull;</span>
          <Link href="/support" className="hover:text-zinc-300 transition-colors">
            Support
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Cleanergy Battery. All rights reserved.</p>
      </footer>
    </div>
  );
}

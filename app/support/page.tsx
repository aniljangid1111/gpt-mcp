import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContactEmails } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Support & Contact | Cleanergy Battery MCP",
  description:
    "Customer support, product inquiry, payment verification assistance, and privacy request page for Cleanergy Battery MCP.",
};

export default function SupportPage() {
  const { supportEmail, privacyEmail, ownerEmail } = getContactEmails();

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-200 antialiased font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-[#0d0e12]/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-white p-1 flex items-center justify-center border border-zinc-700/50">
              <Image
                src="/logo.png"
                alt="Cleanergy Logo"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Cleanergy Battery
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 border-b border-zinc-800 pb-8">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-3">
            CUSTOMER ASSISTANCE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Customer Support & Inquiries
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Get help with battery specifications, orders, Stripe payments, and data requests.
          </p>
        </div>

        {/* Support Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {/* Card 1: Order, Return & Payment Support */}
          <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold mb-4">
              💳
            </div>
            <h2 className="text-base font-bold text-white mb-2">
              Orders, Returns & Payments
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-3">
              Assistance with order receipts, payment confirmations, and order modifications. For any return, cancellation, or refund requests, customers must contact the store owner directly. The owner reviews and handles each request manually on a case-by-case basis (requests are not automatically approved). Please include your <strong>Order ID</strong> and <strong>checkout email</strong> to help identify your order.
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <a
                href={`mailto:${ownerEmail}?subject=Return%20/%20Refund%20Request%20-%20Cleanergy%20Battery`}
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Contact Owner for Returns & Refunds &rarr;
              </a>
              <a
                href={`mailto:${supportEmail}?subject=Order%20Inquiry%20-%20Cleanergy%20Battery`}
                className="text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Email General Support &rarr;
              </a>
            </div>
          </div>

          {/* Card 2: Product & Technical Specifications */}
          <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold mb-4">
              🔋
            </div>
            <h2 className="text-base font-bold text-white mb-2">
              Battery Technical Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
              Assistance with battery chemistry (LiFePO4 and Sodium-Ion), voltage,
              cycle life, dimensions, charging parameters, and system sizing.
            </p>
            <a
              href={`mailto:${supportEmail}?subject=Technical%20Inquiry%20-%20Cleanergy%20Battery`}
              className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Email Technical Team &rarr;
            </a>
          </div>

          {/* Card 3: Cart & MCP Assistant Help */}
          <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold mb-4">
              🤖
            </div>
            <h2 className="text-base font-bold text-white mb-2">
              MCP & ChatGPT Assistance
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
              Trouble using the Cleanergy MCP tools inside ChatGPT, widget loading
              issues, or cart synchronization errors.
            </p>
            <a
              href={`mailto:${supportEmail}?subject=MCP%20Integration%20Issue`}
              className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Report MCP Issue &rarr;
            </a>
          </div>

          {/* Card 4: Privacy & Data Requests */}
          <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold mb-4">
              🛡️
            </div>
            <h2 className="text-base font-bold text-white mb-2">
              Privacy & Data Requests
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
              Requests to access, review, correct, or delete customer information
              associated with your completed orders.
            </p>
            <a
              href={`mailto:${privacyEmail}?subject=Privacy%20Data%20Request`}
              className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Contact Privacy Team &rarr;
            </a>
          </div>
        </div>

        {/* What to Include Section */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 sm:p-8 mb-12 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-3">
            What Information to Include in Your Request
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
            To help us resolve your inquiry as quickly as possible, please include the
            following details in your message:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-zinc-300">
            <li>
              <strong>Order ID</strong> (found on your payment confirmation screen and
              email receipt, e.g. <code>cl...</code>).
            </li>
            <li>
              <strong>Email Address</strong> used during Stripe checkout.
            </li>
            <li>
              <strong>Stripe Checkout Session ID</strong> (if reporting a payment or
              verification issue).
            </li>
            <li>
              <strong>Product Name or Handle</strong> (for battery specification
              questions).
            </li>
            <li>A clear, detailed description of the question or problem.</li>
          </ul>
        </div>

        {/* Operating Hours & Response Expectation */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121316]/90 p-6 sm:p-8 mb-12 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-3">
            Response Times & Communication
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Our support team reviews inquiries in the order received. We typically
              respond within <strong>1 to 2 business days</strong> (Monday through
              Friday, excluding national holidays).
            </p>
            <p>
              For urgent questions regarding battery orders already placed, please
              ensure your Order ID is in the email subject line for prioritized routing.
            </p>
          </div>
        </div>

        {/* Direct Contact Reference */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 sm:p-8 shadow-xl">
          <h2 className="text-base font-bold text-emerald-400 mb-2">
            Direct Contact Information
          </h2>
          <div className="space-y-2 text-xs sm:text-sm text-zinc-300">
            <p>
              <strong>General & Order Support:</strong>{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                {supportEmail}
              </a>
            </p>
            <p>
              <strong>Returns, Cancellations & Owner Contact:</strong>{" "}
              <a
                href={`mailto:${ownerEmail}`}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                {ownerEmail}
              </a>
            </p>
            <p>
              <strong>Privacy Requests:</strong>{" "}
              <a
                href={`mailto:${privacyEmail}`}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                {privacyEmail}
              </a>
            </p>
            <p>
              <strong>Official Website:</strong>{" "}
              <a
                href="https://cleanergybattery.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                cleanergybattery.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/support"
              className="text-emerald-400 font-semibold transition-colors"
            >
              Support
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Cleanergy Battery. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

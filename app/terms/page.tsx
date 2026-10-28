import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContactEmails } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Terms of Service | Cleanergy Battery MCP",
  description:
    "Terms of Service governing the use of the Cleanergy Battery Model Context Protocol (MCP) and public ordering interface.",
};

export default function TermsOfServicePage() {
  const { supportEmail, ownerEmail } = getContactEmails();

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
              href="/support"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 border-b border-zinc-800 pb-8">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-3">
            LEGAL DOCUMENT
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Effective Date: October 27, 2026 &bull; Last Updated: October 27, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
              use of the Cleanergy Battery Model Context Protocol (MCP) server, public
              checkout interface, and related catalog services (collectively, the
              &ldquo;Service&rdquo;). By accessing the Service through ChatGPT, an
              MCP-compatible AI client, or our web pages, you agree to be bound by these
              Terms. If you do not agree to these Terms, you must not use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Description of the Service</h2>
            <p>
              Cleanergy Battery provides an MCP-enabled interface allowing AI clients
              and end users to discover, query, and purchase lithium iron phosphate
              (LiFePO4) and sodium-ion battery solutions for marine, RV, solar, and
              off-grid power applications. The Service enables:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>Browsing and searching the Cleanergy Battery product catalog;</li>
              <li>Viewing battery technical parameters and specification documents;</li>
              <li>Creating and updating temporary shopping carts;</li>
              <li>
                Generating secure Stripe Checkout sessions to complete transactions;
              </li>
              <li>Verifying payment and order status following checkout.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              3. Role of AI and Model Context Protocol (MCP)
            </h2>
            <p>
              You may access our Service via OpenAI&rsquo;s ChatGPT or other third-party
              MCP clients. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                Cleanergy Battery operates the MCP server and backend catalog; OpenAI
                does not operate, endorse, or manage our servers or inventory.
              </li>
              <li>
                AI client interpretations or summaries of product data are generated by
                the AI model. In the event of any discrepancy between conversational
                text and the formal product data or checkout order confirmation, the
                verified order details and official product specifications take
                precedence.
              </li>
              <li>
                Your use of ChatGPT is also subject to OpenAI&rsquo;s Terms of Use and
                policies.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              4. Product Information, Specifications & Availability
            </h2>
            <p>
              We endeavor to describe all battery products, dimensions, voltages,
              capacities, and pricing accurately. However:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>
                All products are subject to stock availability and may be discontinued or
                modified at any time without prior notice.
              </li>
              <li>
                Battery installations and electrical integrations require appropriate
                system design, charging parameters, and safety precautions. You are
                responsible for verifying system compatibility before purchasing and
                installing battery units.
              </li>
              <li>
                In the event of an inadvertent typographical error or inaccurate price
                listing, Cleanergy Battery reserves the right to refuse or cancel orders
                placed for products listed at the incorrect price prior to shipment.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              5. Shopping Cart & Order Placement
            </h2>
            <p>
              Adding an item to your cart does not reserve inventory or lock in pricing.
              A binding contract of sale is formed only when:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-zinc-300">
              <li>You complete payment on the secure Stripe Checkout page; and</li>
              <li>
                Stripe confirms successful payment processing, and an Order ID is
                issued.
              </li>
            </ol>
            <p className="mt-2">
              Following payment, you will receive an automated email confirmation
              detailing the order and purchased products.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              6. Checkout, Payments & Taxes
            </h2>
            <p>
              All payments are processed securely by our third-party payment processor,{" "}
              <strong>Stripe</strong>. By initiating checkout:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>
                You agree to pay the total purchase amount shown on the Stripe Checkout
                screen, including any applicable shipping charges or sales taxes.
              </li>
              <li>
                You authorize Stripe to charge your selected payment method.
              </li>
              <li>
                You warrant that you are authorized to use the designated payment card or
                payment method.
              </li>
              <li>
                Prices are displayed and processed in United States Dollars (USD) unless
                explicitly indicated otherwise during checkout.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              7. Shipping, Delivery & Fulfillment
            </h2>
            <p>
              Shipping destination eligibility is configured through the checkout
              process (currently configured for the United States). You are responsible
              for providing complete, valid delivery address and contact information
              during checkout. We are not liable for delayed, lost, or misdirected
              shipments resulting from inaccurate address details provided by the
              purchaser.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              8. Returns, Refunds & Cancellation Policy
            </h2>
            <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-4 text-xs sm:text-sm text-zinc-300 space-y-2">
              <p className="font-semibold text-amber-400">
                Manual Return & Refund Request Policy:
              </p>
              <p>
                The store&rsquo;s final return policy is currently under review. There is no automated return, cancellation, or refund workflow provided through this application or website.
              </p>
              <p>
                Customers seeking a return, cancellation, or refund must contact the store owner directly. The owner reviews and handles each request manually on a case-by-case basis. Submitting a request does not guarantee approval. All decisions remain subject to applicable consumer protection laws and the store&rsquo;s policies.
              </p>
            </div>
            <p>
              To request a return, cancellation, or refund, or to report transit damage or product issues, please contact the store owner and support team directly:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 text-xs sm:text-sm">
              <li>
                <strong>Direct Owner Email:</strong>{" "}
                <a
                  href={`mailto:${ownerEmail}?subject=Return%20/%20Refund%20Request%20-%20Cleanergy%20Battery`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {ownerEmail}
                </a>
              </li>
              <li>
                <strong>Support Team:</strong>{" "}
                <a
                  href={`mailto:${supportEmail}?subject=Return%20/%20Refund%20Request%20-%20Cleanergy%20Battery`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {supportEmail}
                </a>
              </li>
              <li>
                Please provide your <strong>Order ID</strong>, <strong>checkout email address</strong>, full name, detailed description of the request or issue, and clear photographs of the battery unit and packaging if reporting transit damage.
              </li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              9. Prohibited Uses
            </h2>
            <p>You agree not to use the Service:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>For any fraudulent, unauthorized, or unlawful purpose;</li>
              <li>
                To probe, scan, or test the vulnerability of our MCP API or backend
                servers;
              </li>
              <li>
                To inject malicious code, overload our servers (denial-of-service), or
                circumvent rate limits;
              </li>
              <li>
                To scrape, harvest, or extract data from our catalog using automated
                tools outside the normal intended MCP tool calling mechanisms;
              </li>
              <li>
                To impersonate any person, business entity, or Cleanergy representative.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              10. Intellectual Property
            </h2>
            <p>
              All trademarks, trade names, logos, product names, text, graphics, and
              specifications displayed through the Service are the intellectual property
              of Cleanergy Battery or their respective licensors. You may not copy,
              reproduce, distribute, or create derivative works from our content without
              prior written consent.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              11. Disclaimers of Warranties
            </h2>
            <p className="text-zinc-400">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED
              ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              12. Limitation of Liability
            </h2>
            <p className="text-zinc-400">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLEANERGY BATTERY AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF
              PROFITS, REVENUE, DATA, OR USE, ARISING FROM OR RELATED TO YOUR USE OF THE
              SERVICE OR PURCHASED PRODUCTS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
              DAMAGES. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE TOTAL AMOUNT PAID
              BY YOU FOR THE ORDER GIVING RISE TO THE CLAIM.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              13. Modifications & Termination
            </h2>
            <p>
              We reserve the right to modify, suspend, or terminate the Service or these
              Terms at any time without prior notice. Continued use of the Service after
              any modifications constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              14. Contact & Support
            </h2>
            <p>
              For questions regarding these Terms of Service or order inquiries, please
              contact us:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-2 text-xs sm:text-sm">
              <p>
                <strong className="text-white">Cleanergy Battery</strong>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://cleanergybattery.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  cleanergybattery.com
                </a>
              </p>
              <p>
                Email Support:{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {supportEmail}
                </a>
              </p>
              <p>
                Direct Owner Contact:{" "}
                <a
                  href={`mailto:${ownerEmail}`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {ownerEmail}
                </a>
              </p>
              <p>
                Support Page:{" "}
                <Link
                  href="/support"
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  /support
                </Link>
              </p>
            </div>
          </section>
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
            <Link
              href="/terms"
              className="text-emerald-400 font-semibold transition-colors"
            >
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-zinc-300 transition-colors">
              Support
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Cleanergy Battery. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

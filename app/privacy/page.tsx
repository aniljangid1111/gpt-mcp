import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContactEmails } from "@/lib/contacts";

export const metadata: Metadata = {
  title: "Privacy Policy | Cleanergy Battery MCP",
  description:
    "Privacy Policy for the Cleanergy Battery Model Context Protocol (MCP) service and public ordering interface.",
};

export default function PrivacyPolicyPage() {
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
              href="/terms"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Terms
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Effective Date: October 27, 2026 &bull; Last Updated: October 27, 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Introduction</h2>
            <p>
              Cleanergy Battery (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              operates the Cleanergy Model Context Protocol (MCP) application and its
              associated public web services. This Privacy Policy describes how we
              collect, use, disclose, and protect personal and operational information
              when you interact with our catalog, shopping cart, and order verification
              services via ChatGPT, MCP-compatible client applications, or our public web
              endpoints.
            </p>
            <p>
              We are committed to data minimization and transparency. We only process
              information strictly necessary to provide battery product specifications,
              manage temporary shopping carts, generate secure checkout sessions, and
              fulfill customer orders.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              2. Who Operates the Service
            </h2>
            <p>
              The Cleanergy MCP server and storefront are operated by Cleanergy Battery
              (official store:{" "}
              <a
                href="https://cleanergybattery.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                cleanergybattery.com
              </a>
              ). The MCP endpoint is our direct application layer that communicates with
              our backend administrative services and database to serve product
              information and assist with purchases.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              3. The Role of ChatGPT and MCP
            </h2>
            <p>
              When you use this service through ChatGPT:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                You interact with an AI model provided by OpenAI that communicates with
                our remote MCP server over standard HTTPS/JSON-RPC protocols.
              </li>
              <li>
                The Cleanergy MCP server is independently operated by Cleanergy
                Battery, <strong>not by OpenAI</strong>.
              </li>
              <li>
                OpenAI does not operate or control our product database or backend
                infrastructure. OpenAI&rsquo;s processing of your conversation prompts is
                governed by OpenAI&rsquo;s own terms and privacy policy.
              </li>
              <li>
                Our MCP tools only receive the parameters sent during a tool call
                (e.g., search keywords, merchandise identifiers, cart IDs, or order IDs)
                necessary to answer your query or execute your requested action.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              4. Information We Actually Process
            </h2>
            <p>
              We only process categories of information that are demonstrated by our
              actual application architecture:
            </p>
            <div className="space-y-3 pl-2">
              <div>
                <h3 className="font-semibold text-white">A. Product & Catalog Queries</h3>
                <p className="text-zinc-400">
                  When you search or filter products (e.g. LiFePO4 or sodium-ion
                  batteries), our server processes search keywords, price limits, and
                  technical tags. These queries contain no personal identifying
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">B. Cart Information</h3>
                <p className="text-zinc-400">
                  When you add products to a cart, an anonymous unique cart identifier
                  (e.g. a database CUID) is generated. Cart records store only the
                  selected product IDs, quantities, line totals, and currency code (USD).
                  Carts are not linked to any user identity or account in the MCP layer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  C. Payment & Checkout Information (Handled by Stripe)
                </h3>
                <p className="text-zinc-400">
                  When you request checkout, a unique Stripe Checkout Session is
                  generated. You complete payment directly on Stripe&rsquo;s hosted,
                  secure checkout page.
                </p>
                <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-200">
                  <strong>Payment Card Security Notice:</strong> We do NOT collect,
                  receive, process, or store credit card numbers, CVVs, card expiration
                  dates, or bank account authentication secrets. All sensitive payment
                  card processing is handled exclusively by Stripe in accordance with
                  PCI-DSS Level 1 compliance standards.
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  D. Customer Fulfillment Data (Post-Checkout)
                </h3>
                <p className="text-zinc-400">
                  Upon completion of checkout on Stripe, Stripe transmits order
                  fulfillment details to our backend via cryptographically verified
                  webhooks. This includes:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-zinc-400">
                  <li>Customer name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping address (street, city, state, postal code, country)</li>
                  <li>Billing address</li>
                  <li>Transaction amount, currency, and Stripe payment reference IDs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  E. Server & Application Logs
                </h3>
                <p className="text-zinc-400">
                  Like standard web applications, our hosting infrastructure maintains
                  temporary server logs containing HTTP request methods, response status
                  codes, timestamps, and error messages for diagnostic and security
                  monitoring.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              5. MCP Tool Outputs & Data Minimization
            </h2>
            <p>
              Our MCP tools strictly follow data minimization principles. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                Catalog tools (<code>search_products</code>, <code>list_all_products</code>,{" "}
                <code>featured_products</code>, etc.) return only public merchandise
                data.
              </li>
              <li>
                Cart tools (<code>view_cart</code>, <code>add_to_cart</code>, etc.)
                return only line items, quantities, and price totals for the requested
                cart ID.
              </li>
              <li>
                The <code>verify_payment</code> tool returns only the order ID, payment
                status (&ldquo;PAID&rdquo; / &ldquo;PENDING&rdquo;), item names,
                quantities, and order total. <strong>It never exposes customer names,
                physical addresses, phone numbers, email addresses, or payment card
                tokens back into ChatGPT tool output.</strong>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              6. How We Use Information
            </h2>
            <p>We use the processed information solely for:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>Responding to catalog search requests and technical inquiries;</li>
              <li>Maintaining shopping cart state during your session;</li>
              <li>Generating Stripe Checkout links to enable purchases;</li>
              <li>Verifying payment status to confirm order completion;</li>
              <li>
                Sending automated order confirmation receipts via email (SMTP);
              </li>
              <li>Fulfilling, packaging, and shipping purchased battery products;</li>
              <li>Complying with accounting, tax, and legal obligations;</li>
              <li>Preventing fraudulent transactions and technical abuse.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              7. Third-Party Service Providers
            </h2>
            <p>
              We disclose information only to the following verified service providers
              operating components of our technical infrastructure:
            </p>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs border border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-300 border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Data Processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-400">
                  <tr>
                    <td className="p-3 font-semibold text-white">Stripe</td>
                    <td className="p-3">Payment processing & checkout fulfillment</td>
                    <td className="p-3">
                      Order totals, line items, customer name, email, phone, shipping/billing address, and payment card details (directly entered on Stripe).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Neon (PostgreSQL)</td>
                    <td className="p-3">Secure cloud database hosting (AWS US East)</td>
                    <td className="p-3">
                      Product records, anonymous carts, order records, customer contact/shipping details, and payment status records.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Cloudinary</td>
                    <td className="p-3">Media hosting & Content Delivery Network</td>
                    <td className="p-3">
                      Public product images and technical specification PDF documents (no personal data).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">SMTP / Nodemailer</td>
                    <td className="p-3">Transactional order confirmation emails</td>
                    <td className="p-3">
                      Customer email, recipient name, order ID, items purchased, and shipping address.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">OpenAI</td>
                    <td className="p-3">AI assistant & MCP client interface</td>
                    <td className="p-3">
                      Conversational prompts and structured tool call inputs/outputs.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              We do not sell, rent, or trade your personal information to third parties
              or data brokers for advertising or marketing purposes.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              8. Cookies & Local Storage
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Cookies:</strong> Our public storefront and MCP application do
                not set or use tracking, analytics, or advertising cookies. (Administrative
                session cookies are restricted solely to authenticated store managers on
                the private admin portal).
              </p>
              <p>
                <strong>Browser Local Storage:</strong> The interactive product catalog
                widget utilizes browser <code>localStorage</code> under the key{" "}
                <code>&quot;mcp:cart-id&quot;</code> to store your active anonymous cart
                identifier so your items remain available while interacting with the
                widget. This key contains only a random alphanumeric identifier, no
                personal data, and can be cleared at any time via your browser settings.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">9. Data Retention</h2>
            <p>
              Our data retention corresponds to our actual technical implementation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
              <li>
                <strong>Shopping Carts:</strong> When an order is completed and verified
                paid, cart items are deleted from the database and cart totals are reset
                to zero. Incomplete, abandoned carts remain in the database until manually
                cleared.
              </li>
              <li>
                <strong>Completed Orders & Payments:</strong> Retained in our database to
                fulfill orders, satisfy statutory tax and commercial accounting
                obligations, and provide warranty support.
              </li>
              <li>
                <strong>Server Logs:</strong> Maintained temporarily by the hosting
                platform for system diagnostics and automatically rotated.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">10. Data Security</h2>
            <p>
              We implement industry-standard safeguards to protect information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>All web traffic and MCP tool calls are encrypted in transit over HTTPS (TLS).</li>
              <li>Database connections use encrypted SSL connections with channel binding.</li>
              <li>Stripe webhooks are cryptographically validated using HMAC signatures before processing.</li>
              <li>Administrative backend endpoints require bearer token authentication or secure HTTP-only cookies.</li>
              <li>No payment card data is ever received or stored on our servers.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              11. User Controls & Privacy Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights under applicable data
              protection laws (such as GDPR, CCPA, or state privacy laws) to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300">
              <li>Request access to the personal data we hold about your completed orders;</li>
              <li>Request correction of inaccurate shipping or contact details;</li>
              <li>Request deletion of your personal data, subject to legal retention obligations;</li>
              <li>Inquire about the processing of your data.</li>
            </ul>
            <p className="mt-2">
              Because user account registration is not implemented in this version,
              there is no self-serve account dashboard. All privacy and data requests
              are handled manually by our team. To exercise any of these rights, please
              contact us at{" "}
              <a
                href={`mailto:${privacyEmail}`}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                {privacyEmail}
              </a>{" "}
              or via our{" "}
              <Link
                href="/support"
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                Support Page
              </Link>
              . Please include your Order ID and the email address used during Stripe
              checkout so we can verify your identity.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              12. International Data Transfers
            </h2>
            <p>
              Our backend databases, hosting providers, and payment processors operate
              servers located primarily in the United States. If you interact with our
              service from outside the United States, your information will be
              transferred to, stored, and processed in the United States in accordance
              with this Privacy Policy and applicable data transfer frameworks.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              13. Children&rsquo;s Privacy
            </h2>
            <p>
              Our services are directed to businesses and adult consumers seeking energy
              storage and battery products. We do not knowingly solicit or collect
              personal information from children under the age of 18. If you believe a
              minor has provided us with personal information, please contact us
              immediately.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">
              14. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect operational,
              technical, or regulatory changes. Any updates will be posted directly to
              this page with a revised &ldquo;Last Updated&rdquo; date. We encourage you
              to review this page periodically.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">15. Contact Information</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy
              or our data handling practices, please contact us:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-[#121316] p-5 space-y-2 text-xs sm:text-sm">
              <p>
                <strong className="text-white">Cleanergy Battery</strong>
              </p>
              <p>
                Official Website:{" "}
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
                Privacy Inquiries:{" "}
                <a
                  href={`mailto:${privacyEmail}`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {privacyEmail}
                </a>
              </p>
              <p>
                Customer Support:{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {supportEmail}
                </a>
              </p>
              <p>
                Owner Contact:{" "}
                <a
                  href={`mailto:${ownerEmail}`}
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  {ownerEmail}
                </a>
              </p>
              <p>
                Public Support Page:{" "}
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
            <Link
              href="/privacy"
              className="text-emerald-400 font-semibold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
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

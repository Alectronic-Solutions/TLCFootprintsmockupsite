import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Logo } from "./Logo";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { HeartDots } from "@/components/brand/HeartDots";
import { BRIGHTWHEEL, BUSINESS, NAV_LINKS } from "@/lib/constants";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

const SOCIAL_LINK =
  "grid h-11 w-11 place-items-center rounded-full transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream-deep";

const SPRIG =
  "pointer-events-none absolute bottom-3 hidden h-28 w-auto opacity-50 min-[1400px]:block 2xl:h-36";

const EYEBROW = "text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark";

const CONTACT_ROW =
  "flex items-center gap-2.5 text-sm font-medium text-cocoa transition-colors hover:text-pink-dark";

const OUT_ICON =
  "shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

const TIKTOK_NOTE =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient
          id="footer-ig-gradient"
          cx="30%"
          cy="107%"
          r="150%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#fdf497" />
          <stop offset="0.05" stopColor="#fdf497" />
          <stop offset="0.45" stopColor="#fd5949" />
          <stop offset="0.6" stopColor="#d6249f" />
          <stop offset="0.9" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="url(#footer-ig-gradient)" strokeWidth="2.2">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.4" />
      </g>
      <circle cx="17.6" cy="6.4" r="1.3" fill="#d6249f" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="-1 -1 26 26" className={className} aria-hidden="true">
      <path d={TIKTOK_NOTE} fill="#25f4ee" transform="translate(-0.7 -0.7)" />
      <path d={TIKTOK_NOTE} fill="#fe2c55" transform="translate(0.7 0.7)" />
      <path d={TIKTOK_NOTE} fill="#010101" />
    </svg>
  );
}

/**
 * Four groups: who we are, where to go, how to reach us, and the family
 * portal. Below lg every group is centered, so the column reads as one
 * spine; from lg all four sit side by side on a shared left edge. On a phone
 * the groups stack, with Explore's links split into two columns. From sm,
 * Explore and contact share a row.
 *
 * A mirrored pair of sprigs stands in the bottom corners, the way the two
 * sprigs flank the rainbow in the logo. Only from 1400px, where the gutters are
 * wide enough to hold them clear of the columns.
 *
 * No top border. Most pages hand over from the CTA band's arc, which already
 * draws the seam, and a hairline under it read as a stray second edge. The
 * heart divider marks the start of the footer on pages without the band.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream-deep">
      <BotanicalSprig still leavesOnly className={`-left-4 ${SPRIG}`} />
      <BotanicalSprig flip still leavesOnly className={`-right-4 ${SPRIG}`} />

      {/* The extra bottom padding below md keeps the last line clear of the
          floating back-to-top button, which sits above the action bar. */}
      <div className="container-page relative pb-20 pt-10 sm:pt-12 md:pb-8">
        <HeartDots className="mb-10 sm:mb-12" />

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-[2fr_3fr] sm:gap-x-8 lg:grid-cols-[1.35fr_0.75fr_1fr_1.1fr] lg:gap-x-10">
          <div className="text-center sm:col-span-2 lg:col-span-1 lg:text-left">
            <Logo variant="compact" asLink={false} />
            <p className="mx-auto mt-4 max-w-sm text-balance text-sm leading-relaxed text-cocoa-mid lg:mx-0 lg:max-w-xs lg:text-pretty">
              A licensed California Family Child Care Home in {BUSINESS.city}, offering
              play-based, child-led care for children birth through age five and welcoming
              Child Action families.
            </p>

            <a
              href={BUSINESS.licenseRecordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 rounded-full border-hair border-leaf/25 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-cocoa transition-colors hover:border-leaf/50 hover:bg-white"
            >
              <BadgeCheck className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
              <span>
                State licensed{" "}
                <span className="tabular font-medium text-cocoa-mid">#{BUSINESS.license}</span>
              </span>
              <ArrowUpRight className={`h-3.5 w-3.5 text-cocoa-mid ${OUT_ICON}`} aria-hidden="true" />
              {NEW_TAB}
            </a>

            {/* From lg, pulled left by the hit area's inset, so the glyphs sit on
                the same edge as the text above rather than 8px in from it. */}
            <ul className="mt-4 flex items-center justify-center gap-2 lg:-ml-2 lg:justify-start">
              <li>
                <a
                  href={BUSINESS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow T.L.C. Footprints on Instagram"
                  title="Instagram"
                  className={SOCIAL_LINK}
                >
                  <InstagramIcon className="h-7 w-7" />
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow T.L.C. Footprints on TikTok"
                  title="TikTok"
                  className={SOCIAL_LINK}
                >
                  <TikTokIcon className="h-7 w-7" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-explore" className="text-center lg:text-left">
            <h2 id="footer-explore" className={EYEBROW}>
              Explore
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="leading-tight">
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-cocoa transition-colors hover:text-pink-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-center lg:text-left">
            <h2 className={EYEBROW}>Get in touch</h2>
            {/* Centered as one block, rows left-aligned inside it, so the icons
                stand in a single column instead of zig-zagging with each
                row's width. */}
            <ul className="mx-auto mt-4 w-fit space-y-3 text-left lg:mx-0">
              <li>
                <a href={BUSINESS.phoneHref} className={CONTACT_ROW}>
                  <Phone className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>
                    Call <span className="tabular">{BUSINESS.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={BUSINESS.smsHref} className={CONTACT_ROW}>
                  <MessageSquare className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  <span>
                    Text <span className="tabular">{BUSINESS.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={BUSINESS.emailHref} className={CONTACT_ROW}>
                  <Mail className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-cocoa-mid">
                <MapPin className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                {BUSINESS.city}, {BUSINESS.state}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-cocoa-mid">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                <span>
                  {BUSINESS.hours.days}
                  <br />
                  <span className="tabular">
                    {BUSINESS.hours.open} to {BUSINESS.hours.close}
                  </span>
                  <span className="mt-1 block text-xs">{BUSINESS.hours.closed}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* The family portal as one small card, so it reads as a destination
              rather than two more links in a list. */}
          <div className="text-center sm:col-span-2 lg:col-span-1 lg:text-left">
            <h2 className={EYEBROW}>Families</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-white/70">
              <div aria-hidden="true" className="rule-rainbow h-1 w-full" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-1">
                <div className="p-4">
                  <p className="text-sm font-semibold text-cocoa">Prospective families</p>
                  <p className="mt-1 text-xs leading-relaxed text-cocoa-mid">
                    Join our interest list through Brightwheel.
                  </p>
                  <a
                    href={BRIGHTWHEEL.interestListUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-full bg-pink-dark px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_0_0_#8A1A33] transition-colors hover:bg-[#AD2543] active:translate-y-px active:shadow-[0_1px_0_0_#8A1A33]"
                  >
                    Join the Interest List
                    <ArrowUpRight className={`h-4 w-4 ${OUT_ICON}`} aria-hidden="true" />
                    {NEW_TAB}
                  </a>
                </div>
                <div className="flex flex-col items-center justify-center border-t-hair border-cocoa/10 bg-cream-deep/50 p-4 sm:border-l-hair sm:border-t-0 lg:items-start lg:border-l-0 lg:border-t-hair">
                  <p className="text-sm font-semibold text-cocoa">Current families</p>
                  <p className="mt-1 text-xs leading-relaxed text-cocoa-mid">
                    Forms, messages, and payments.
                  </p>
                  <a
                    href={BRIGHTWHEEL.familySignInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full border-hair border-cocoa/25 bg-white px-5 py-2 text-sm font-semibold text-cocoa shadow-[0_2px_0_0_rgba(62,42,33,0.10)] transition-[transform,box-shadow,background-color,border-color] duration-200 hover:border-cocoa/40 hover:bg-cream hover:text-pink-dark active:translate-y-px active:shadow-[0_1px_0_0_rgba(62,42,33,0.10)] motion-reduce:transition-none"
                  >
                    Brightwheel sign-in
                    <ArrowUpRight className={`h-3.5 w-3.5 ${OUT_ICON}`} aria-hidden="true" />
                    {NEW_TAB}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t-hair border-cocoa/10 pt-6 text-center text-xs leading-5 text-cocoa-mid lg:flex-row lg:justify-between lg:text-left">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-pink-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Designed with care by{" "}
            <a
              href="https://alectronicsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cocoa transition-colors hover:text-pink-dark"
            >
              Alectronic Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

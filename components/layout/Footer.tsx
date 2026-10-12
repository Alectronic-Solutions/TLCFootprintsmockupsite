import Link from "next/link";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { HeartDots } from "@/components/brand/HeartDots";
import { BUSINESS, NAV_LINKS } from "@/lib/constants";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

const SOCIAL_LINK =
  "grid h-11 w-11 place-items-center rounded-full transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream-deep";

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

export function Footer() {
  return (
    <footer className="border-t-hair border-cocoa/10 bg-cream-deep">
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="text-center md:text-left">
            <Logo variant="compact" asLink={false} />
            <p className="mt-4 text-sm text-cocoa-mid md:max-w-xs">
              A licensed California Family Child Care Home in {BUSINESS.city}, offering
              play-based, child-led care for children birth through age five and welcoming
              Child Action families.
            </p>
            <p className="mt-4 text-sm text-cocoa-mid">
              License{" "}
              <a
                href={BUSINESS.licenseRecordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cocoa/30 underline-offset-2 transition-colors hover:text-pink-dark"
              >
                #{BUSINESS.license}
              </a>
            </p>

            <div className="mt-5">
              <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark">
                Follow along
              </p>
              <ul className="mt-3 flex items-center justify-center gap-3 md:justify-start">
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
          </div>

          <div className="grid grid-cols-[2fr_3fr] items-start gap-x-4 gap-y-8 md:contents">
            <div>
              <h2 className="text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark">
                Explore
              </h2>
              <ul className="mt-4 space-y-3">
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
            </div>

            <div>
              <h2 className="text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark">
                Get in touch
              </h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={BUSINESS.phoneHref}
                    className="flex items-center gap-2.5 text-sm font-medium text-cocoa transition-colors hover:text-pink-dark"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                    {BUSINESS.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={BUSINESS.smsHref}
                    className="flex items-center gap-2.5 text-sm font-medium text-cocoa transition-colors hover:text-pink-dark"
                  >
                    <MessageSquare
                      className="h-4 w-4 shrink-0 text-leaf-dark"
                      aria-hidden="true"
                    />
                    Send a text
                  </a>
                </li>
                <li>
                  <a
                    href={BUSINESS.emailHref}
                    className="flex items-center gap-2.5 break-all text-sm font-medium text-cocoa transition-colors hover:text-pink-dark"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                    {BUSINESS.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-cocoa-mid">
                  <MapPin className="h-4 w-4 shrink-0 text-leaf-dark" aria-hidden="true" />
                  {BUSINESS.city}, {BUSINESS.state}
                </li>
              </ul>

              <p className="mt-5 text-sm text-cocoa-mid">
                {BUSINESS.hours.days}
                <br />
                {BUSINESS.hours.open} to {BUSINESS.hours.close}
                <br />
                <span className="text-xs">{BUSINESS.hours.closed}</span>
              </p>
            </div>
          </div>
        </div>

        <HeartDots className="mt-9" />

        <div className="mt-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-cocoa-mid">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-cocoa-mid transition-colors hover:text-pink-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-cocoa-mid">
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
    </footer>
  );
}

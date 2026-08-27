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

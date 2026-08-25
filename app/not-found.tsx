import Link from "next/link";
import { Footprint } from "@/components/brand/Footprints";
import { Button } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

const LINKS = [
  { href: "/programs", label: "Programs and rates" },
  /* Was "/#availability", which no longer exists: the home page's "Current
     openings" section was folded into the hero status pill and the highlights
     bar. The enrolling status is on the home page and in the FAQ below, so
     this slot goes to a page that was not otherwise reachable from here. */
  { href: "/what-to-expect", label: "What to expect day to day" },
  { href: "/tour", label: "Request a tour" },
  { href: "/faq", label: "Frequently asked questions" },
];

export default function NotFound() {
  return (
    <section className="bg-cream pt-[var(--header-h)]">
      <div className="container-prose py-14 text-center sm:py-20">
        <div className="flex justify-center gap-2" aria-hidden="true">
          <Footprint className="h-10 w-auto rotate-[-14deg] fill-leaf" left />
          <Footprint className="h-10 w-auto rotate-[10deg] fill-pink" />
        </div>

        <h1 className="text-3d mt-8 text-h1">This page wandered off</h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-body">
          The link you followed does not lead anywhere on this site. Here is where most
          people are heading.
        </p>

        <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-xl border-hair border-cocoa/10 bg-cream-deep px-5 py-4 font-semibold text-cocoa transition-colors hover:bg-leaf-light/60"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button href="/">Back to the home page</Button>
        </div>

        <p className="mt-8 text-sm text-cocoa-mid">
          Or just call or text{" "}
          <a
            href={BUSINESS.phoneHref}
            className="font-semibold text-cocoa underline underline-offset-4 hover:text-pink-dark"
          >
            {BUSINESS.phone}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

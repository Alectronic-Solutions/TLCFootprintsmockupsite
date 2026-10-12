import { ExternalLink, Search } from "lucide-react";

/**
 * The licence number, handed over as a link to the state's own record.
 *
 * The unfiltered search stays as a secondary link: a parent should look up
 * every provider on their list, not only this one.
 */
export function LicenseLookup({
  license,
  recordUrl,
  searchUrl,
  buttonLabel = "Open my record on the state site",
}: {
  license: string;
  recordUrl: string;
  searchUrl: string;
  buttonLabel?: string;
}) {
  return (
    <div className="text-center">
      {/* Presented as a fact, not a form field. */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="text-eyebrow font-bold uppercase tracking-[0.12em] text-leaf-dark">
          License
        </span>
        <a
          href={recordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tabular font-mono text-2xl font-semibold tracking-wide text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
        >
          {license}
        </a>
      </div>

      <a
        href={recordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-cocoa px-6 text-base font-semibold text-cream shadow-[0_2px_0_0_rgba(30,19,14,0.9)] transition-colors duration-200 hover:bg-cocoa-mid active:translate-y-px active:shadow-[0_1px_0_0_rgba(30,19,14,0.9)] sm:w-auto"
      >
        {buttonLabel}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>

      {/* Not `whitespace-nowrap`. This sentence is ~500px on one line, which is
          wider than a 390px phone - it forced a horizontal scrollbar onto the
          whole About page, and the cause was invisible because the text itself
          fits inside its own centred column. `text-balance` gets the tidy rag
          the nowrap was reaching for, without setting a floor on the width. */}
      <p className="mt-3 text-balance text-sm text-cocoa/70">
        Opens the California Department of Social Services record in a new tab.
      </p>

      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark"
      >
        <Search className="h-3.5 w-3.5" aria-hidden="true" />
        Look up any other provider
      </a>
    </div>
  );
}

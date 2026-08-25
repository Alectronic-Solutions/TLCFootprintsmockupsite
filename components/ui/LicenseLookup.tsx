import { ExternalLink, Search } from "lucide-react";

/**
 * The licence number, handed over as a link to the state's own record.
 *
 * This used to be a two-step errand: copy the nine digits, open the registry,
 * paste them into the facility-number box. That choreography existed only
 * because a deep link to the record was tried once and did not work. It works
 * now, so the number is a link and the errand is a click. The copy button and
 * the paste instruction went with it; they were scaffolding for a step that no
 * longer exists.
 *
 * The unfiltered search stays as a secondary link, because the point of this
 * section is that a parent should look up every provider on their list, not
 * only this one. That page is not ours to design, hence the plain wording.
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
      {/* Presented as a fact being handed over, not as a form field. The inset
          well this used to sit in read as an input a parent was meant to fill. */}
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
        className="btn-shine mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-cocoa-mid to-cocoa px-6 text-base font-semibold text-cream shadow-[0_2px_0_0_rgba(30,19,14,0.9),0_6px_14px_-4px_rgba(62,42,33,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_3px_0_0_rgba(30,19,14,0.9),0_12px_22px_-6px_rgba(62,42,33,0.4)] active:translate-y-px active:shadow-[0_1px_0_0_rgba(30,19,14,0.9)] sm:w-auto"
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

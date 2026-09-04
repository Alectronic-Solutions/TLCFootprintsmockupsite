import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { ResourceIcon } from "@/components/brand/ResourceIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CurrentMonth } from "@/components/ui/CurrentMonth";
import type { ArticleMeta } from "@/lib/mdx";
import { TOPIC_LABELS } from "@/lib/mdx";
import { cn } from "@/lib/cn";

/**
 * One card in the resource library grid.
 *
 * Everything reads centered, which is the reason the meta row's arrow moved
 * out of that row and into its own "Read the guide" line below: `ml-auto` is
 * what pins an arrow to a row's trailing edge, and there is no centered
 * equivalent of that trick.
 *
 * Badge tint alternates by topic rather than all sharing one color, the same
 * "never let a set of five read as identical" rule HighlightIcon and the
 * credential discs follow.
 */
const TOPIC_TINT: Record<ArticleMeta["topic"], string> = {
  choosing: "bg-pink-light",
  cost: "bg-amber-light",
  licensing: "bg-leaf-light",
  starting: "bg-pink-light",
  "day-to-day": "bg-amber-light",
  health: "bg-leaf-light",
  family: "bg-leaf-light",
};

export function ResourceCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="group h-full">
      <Link
        href={`/resources/${article.slug}`}
        className="card-lift card-rule flex h-full flex-col items-center overflow-hidden rounded-2xl border-hair border-cocoa/10 bg-white p-7 text-center shadow-soft transition-colors duration-200 group-hover:border-pink/25"
      >
        <span
          className={cn(
            "grid h-14 w-14 place-items-center rounded-full border-hair border-cocoa/10 transition-transform duration-200 group-hover:scale-105",
            TOPIC_TINT[article.topic],
          )}
        >
          <ResourceIcon topic={article.topic} className="h-6 w-6" />
        </span>

        <SectionLabel className="mt-4 text-center text-xs">
          {TOPIC_LABELS[article.topic]}
        </SectionLabel>

        <h2 className="mt-2 text-h3 group-hover:text-pink-dark">{article.title}</h2>
        <p className="mx-auto mt-3 max-w-[42ch] flex-1">{article.summary}</p>

        <div className="mt-6 flex items-center justify-center gap-3 border-t-hair border-cocoa/10 pt-4 text-sm text-cocoa-mid">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingTime} min read
          </span>
          <span aria-hidden="true">·</span>
          <span>Updated <CurrentMonth /></span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pink-dark">
          Read the guide
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Link>
    </article>
  );
}

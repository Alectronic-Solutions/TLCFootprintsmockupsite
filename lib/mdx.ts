import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Resource library loader.
 *
 * Articles are evergreen and undated on purpose. A solo provider caring for
 * children ten hours a day will not post weekly, and an abandoned blog with a
 * stale top post costs more credibility than it earns. These show "last
 * updated" instead, so silence never looks like neglect.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "resources");

/** The resource topics are authored per article in
 *  frontmatter, not inferred, so a new article has to be filed on purpose. */
export type ArticleTopic =
  | "choosing"
  | "cost"
  | "licensing"
  | "starting"
  | "day-to-day"
  | "health"
  | "family";

const TOPICS: ArticleTopic[] = [
  "choosing",
  "cost",
  "licensing",
  "starting",
  "day-to-day",
  "health",
  "family",
];

/** Display label for each topic, in the order the filter/eyebrow should use. */
export const TOPIC_LABELS: Record<ArticleTopic, string> = {
  choosing: "Choosing a provider",
  cost: "Cost and subsidies",
  licensing: "Licensing",
  starting: "Starting out",
  "day-to-day": "Day to day",
  health: "Health and safety",
  family: "Family records",
};

function parseTopic(value: unknown): ArticleTopic {
  return typeof value === "string" && (TOPICS as string[]).includes(value)
    ? (value as ArticleTopic)
    : "choosing";
}

export interface ArticleMeta {
  slug: string;
  title: string;
  summary: string;
  /** Optional shorter search/social copy; visible article copy stays unchanged. */
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  updated: string;
  readingTime: number;
  related: string[];
  topic: ArticleTopic;
}

export interface Article extends ArticleMeta {
  body: string;
}

function readingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function parseFile(fileName: string): Article {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    updated: String(data.updated ?? ""),
    readingTime: readingTimeMinutes(content),
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    topic: parseTopic(data.topic),
    body: content,
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getRelated(article: Article): ArticleMeta[] {
  const all = getAllArticles();
  const picked = article.related
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a));

  // Every article links to at least two siblings, so top up from the rest if
  // the frontmatter lists fewer.
  if (picked.length >= 2) return picked.slice(0, 3);

  const filler = all.filter(
    (a) => a.slug !== article.slug && !picked.some((p) => p.slug === a.slug),
  );
  return [...picked, ...filler].slice(0, 3);
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Interactive lists for the family guides, authored in MDX as
 * `<CopyList items={[...]} />` and `<Checklist id="..." items={[...]} />`.
 *
 * Items are passed as plain strings rather than as a nested markdown list so
 * the copied text is exactly what the reader sees, with no walking of
 * rendered children to recover it.
 */

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and non-secure origins have no async clipboard.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

/** Which line (or "all") was just copied, cleared again after a moment. */
function useCopied() {
  const [copied, setCopied] = useState<number | "all" | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(key: number | "all", text: string) {
    if (!(await writeClipboard(text))) return;
    setCopied(key);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1800);
  }

  return [copied, copy] as const;
}

function CopiedNotice({ copied }: { copied: number | "all" | null }) {
  return (
    <p aria-live="polite" className="sr-only">
      {copied === "all" ? "List copied" : copied !== null ? "Copied" : ""}
    </p>
  );
}

function CopyAllButton({
  copied,
  label,
  onClick,
}: {
  copied: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} data-copied={copied || undefined} className="guide-copy-all">
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}

/** Tap a line to copy it, or copy the whole list at once. */
export function CopyList({
  items,
  ordered = false,
  className,
}: {
  items: string[];
  ordered?: boolean;
  className?: string;
}) {
  const [copied, copy] = useCopied();

  const List = ordered ? "ol" : "ul";
  const everything = items
    .map((item, index) => (ordered ? `${index + 1}. ${item}` : `- ${item}`))
    .join("\n");

  return (
    <div className={cn("guide-copy", className)}>
      <List className="guide-copy-list">
        {items.map((item, index) => {
          const done = copied === index;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => copy(index, item)}
                data-copied={done || undefined}
                className="guide-copy-item"
              >
                {ordered ? (
                  <span className="guide-copy-n tabular" aria-hidden="true">
                    {index + 1}.
                  </span>
                ) : (
                  <span className="guide-copy-dot" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">{item}</span>
                <span className="guide-copy-icon" aria-hidden="true">
                  {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {done ? <span>Copied</span> : null}
                </span>
                <span className="sr-only">, copy to clipboard</span>
              </button>
            </li>
          );
        })}
      </List>

      <div className="guide-copy-bar">
        <span>Tap a line to copy it.</span>
        <CopyAllButton
          copied={copied === "all"}
          label={`Copy all ${items.length}`}
          onClick={() => copy("all", everything)}
        />
      </div>

      <CopiedNotice copied={copied} />
    </div>
  );
}

/*
 * Checked items are remembered in this browser, keyed by the checklist id and
 * the item's text, so a reworded item starts unchecked instead of inheriting
 * another line's tick. One shared store keeps every rendering of the same
 * list in step (the book draws a page twice while it turns).
 */
const STORAGE_PREFIX = "tlc-checklist:";
const EMPTY: string[] = [];
const cache = new Map<string, string[]>();
const listeners = new Set<() => void>();

function readChecks(id: string): string[] {
  const hit = cache.get(id);
  if (hit) return hit;
  let value = EMPTY;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_PREFIX + id) ?? "null");
    if (Array.isArray(parsed)) value = parsed.filter((v): v is string => typeof v === "string");
  } catch {
    value = EMPTY;
  }
  cache.set(id, value);
  return value;
}

function writeChecks(id: string, next: string[]) {
  cache.set(id, next);
  try {
    if (next.length) window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_PREFIX + id);
  } catch {
    // Storage blocked: the ticks still work for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed a list.
  const onStorage = (event: StorageEvent) => {
    if (!event.key?.startsWith(STORAGE_PREFIX)) return;
    cache.delete(event.key.slice(STORAGE_PREFIX.length));
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** A checklist line may hold a markdown link, e.g. "[request a tour](/tour)". */
function ItemText({ item }: { item: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of item.matchAll(LINK)) {
    const [whole, text, href] = match;
    const at = match.index ?? 0;
    parts.push(item.slice(last, at));
    const cls =
      "font-semibold text-cocoa underline decoration-pink/50 underline-offset-4 transition-colors hover:text-pink-dark";
    parts.push(
      href.startsWith("/") ? (
        <Link key={at} href={href} className={cls}>
          {text}
        </Link>
      ) : (
        <a key={at} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {text}
        </a>
      ),
    );
    last = at + whole.length;
  }
  parts.push(item.slice(last));
  return <>{parts}</>;
}

/** A copied checklist line, as a box ticked or not to match the page. */
function boxLine(item: string, on: boolean) {
  return `${on ? "☑" : "☐"} ${item.replace(LINK, "$1")}`;
}

/**
 * A list of statements the reader can tick off. Lines copy as checkbox lines
 * (☐ / ☑), so the list pastes into a notes app ready to tick there too.
 */
export function Checklist({
  id,
  items,
  className,
}: {
  id: string;
  items: string[];
  className?: string;
}) {
  const checked = useSyncExternalStore(
    subscribe,
    () => readChecks(id),
    () => EMPTY,
  );
  const [copied, copy] = useCopied();
  const count = items.filter((item) => checked.includes(item)).length;
  const complete = count === items.length;
  const everything = items.map((item) => boxLine(item, checked.includes(item))).join("\n");

  function toggle(item: string) {
    writeChecks(
      id,
      checked.includes(item) ? checked.filter((c) => c !== item) : [...checked, item],
    );
  }

  return (
    <div className={cn("guide-check", className)}>
      <ul className="guide-check-list">
        {items.map((item, index) => {
          const on = checked.includes(item);
          const done = copied === index;
          return (
            <li key={item} className="guide-check-row" data-checked={on || undefined}>
              <label className="guide-check-item">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item)}
                  className="guide-check-input"
                />
                <span className="guide-check-mark" aria-hidden="true">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1">
                  <ItemText item={item} />
                </span>
              </label>
              <button
                type="button"
                onClick={() => copy(index, boxLine(item, on))}
                data-copied={done || undefined}
                className="guide-check-copy"
                title="Copy this line"
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {done ? <span aria-hidden="true">Copied</span> : null}
                <span className="sr-only">Copy this line</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="guide-check-bar">
        <span className="guide-check-meter" aria-hidden="true">
          <span style={{ width: `${(count / items.length) * 100}%` }} />
        </span>
        <span aria-live="polite" className="tabular" data-complete={complete || undefined}>
          {complete ? `All ${items.length} checked` : `${count} of ${items.length} checked`}
        </span>
        {count > 0 ? (
          <button type="button" onClick={() => writeChecks(id, EMPTY)} className="guide-check-clear">
            Clear
          </button>
        ) : null}
        <CopyAllButton copied={copied === "all"} label="Copy list" onClick={() => copy("all", everything)} />
      </div>

      <CopiedNotice copied={copied} />
    </div>
  );
}

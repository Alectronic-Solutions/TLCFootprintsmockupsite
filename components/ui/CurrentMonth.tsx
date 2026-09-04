"use client";

import { useEffect, useState } from "react";

/**
 * A freshness label for public-facing information. The site is for a
 * California program, so use its local calendar rather than the visitor's
 * timezone. This matters around the first of a month for families browsing
 * from another timezone.
 */
function formatCurrentMonth(): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  }).format(new Date());
}

/**
 * Shows the current California month after hydration and refreshes it while a
 * page remains open. The server-rendered fallback deliberately avoids a
 * dated value, so a statically exported page never advertises an old month
 * before its JavaScript loads.
 */
export function CurrentMonth() {
  const [month, setMonth] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setMonth(formatCurrentMonth());
    refresh();

    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return <>{month ?? "this month"}</>;
}

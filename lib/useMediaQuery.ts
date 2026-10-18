"use client";

import { useEffect, useState } from "react";

/**
 * Whether a media query currently matches. False on the server and on the
 * first client render, so markup never depends on it - use it for behaviour
 * (which animation to run), and CSS breakpoints for layout.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

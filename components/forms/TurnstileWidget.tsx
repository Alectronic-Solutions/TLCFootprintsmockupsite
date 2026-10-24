"use client";

import { useEffect, useRef, useState } from "react";

const TURNSTILE_SITE_KEY = "0x4AAAAAAEgU5JeUfdAAjsK6";
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
  }
}

export function TurnstileWidget({
  onTokenChange,
}: {
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [armed, setArmed] = useState(false);

  // Cloudflare is not contacted just because the page was opened. The script
  // loads once the visitor starts filling in the form it belongs to.
  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) {
      setArmed(true);
      return;
    }
    const arm = () => setArmed(true);
    form.addEventListener("focusin", arm, { once: true });
    form.addEventListener("input", arm, { once: true });
    return () => {
      form.removeEventListener("focusin", arm);
      form.removeEventListener("input", arm);
    };
  }, []);

  useEffect(() => {
    if (!armed) return;
    let cancelled = false;

    const renderWidget = () => {
      if (
        cancelled ||
        !containerRef.current ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => onTokenChange(token),
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
        // The site is light-only (see color-scheme in globals.css).
        theme: "light",
        size: "flexible",
      });
    };

    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
    } else {
      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener("load", renderWidget);

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
      onTokenChange("");
    };
  }, [armed, onTokenChange]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="mx-auto min-h-[65px] max-w-[420px]" />
      <p className="text-center text-xs text-cocoa-mid">
        {armed
          ? "Protected by Cloudflare Turnstile spam protection."
          : "Spam protection from Cloudflare Turnstile loads when you start filling in this form."}
      </p>
    </div>
  );
}

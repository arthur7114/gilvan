"use client";

import { useEffect } from "react";

type FacebookPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FacebookPixel;
    _fbq?: FacebookPixel;
  }
}

export function MetaPixel({ pixelId, surveySlug, campaignName }: { pixelId: string; surveySlug: string; campaignName: string }) {
  useEffect(() => {
    if (!pixelId || window.fbq) return;
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    } as FacebookPixel;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", pixelId);
    fbq("track", "PageView", { content_category: "survey", content_name: campaignName, survey_slug: surveySlug });
  }, [campaignName, pixelId, surveySlug]);

  if (!pixelId) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
    </noscript>
  );
}

"use client";

import Script from "next/script";

export function VoiceflowWidgetLoader() {
  return (
    <Script
      id="vf-widget"
      src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
      strategy="afterInteractive"
      onLoad={() => {
        try {
          if (window.__vf_loaded) return;
          window.__vf_loaded = true;

          window.voiceflow?.chat?.load?.({
            verify: { projectID: "6894bac6111efc425643a6c0" },
            url: "https://general-runtime.voiceflow.com",
            versionID: "production",
            voice: { url: "https://runtime-api.voiceflow.com" },
            user: {
              // Stable session id to avoid Safari/ITP issues; replace with a real user id if logged-in.
              id: (() => {
                try {
                  const key = "__vf_uid";
                  const existing = window.localStorage.getItem(key);
                  if (existing) return existing;
                  const uid = window.crypto.randomUUID?.() ?? String(Date.now());
                  window.localStorage.setItem(key, uid);
                  return uid;
                } catch (error) {
                  console.warn("[Voiceflow] uid fallback", error);
                  return String(Date.now());
                }
              })(),
            },
          });

          console.info("[Voiceflow] widget initialized");
        } catch (error) {
          console.error("[Voiceflow] init error", error);
        }
      }}
      onError={(event) => {
        console.error("[Voiceflow] failed to load widget script", event);
      }}
    />
  );
}

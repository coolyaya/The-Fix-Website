"use client";

import Script from "next/script";

const VOICEFLOW_WIDGET_SNIPPET = `
  (function(d, t) {
    var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
    v.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '6894bac6111efc425643a6c0' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        }
      });
    };
    v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    v.type = "text/javascript";
    s.parentNode.insertBefore(v, s);
  })(document, 'script');
`;

export function VoiceflowWidgetLoader() {
  return (
    <Script
      id="vf-widget"
      type="text/javascript"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: VOICEFLOW_WIDGET_SNIPPET }}
    />
  );
}

"use client";

import Script from "next/script";

export default function GoogleAdsense() {
    return (
        <Script
            id="google-adsense"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4986993922938185"
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onLoad={() => {
                console.log("AdSense Script Loaded Successfully");
            }}
            onError={(e) => {
                console.error("AdSense Script Failed to Load", e);
            }}
        />
    );
}

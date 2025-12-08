"use client";

import { useEffect } from "react";

export default function GoogleAdsense() {
    useEffect(() => {
        try {
            // Check if script already exists to prevent duplicates
            if (document.querySelector('script[src*="adsbygoogle.js"]')) {
                console.log("AdSense script already exists");
                return;
            }

            console.log("Attempting to inject AdSense script manually...");
            const script = document.createElement("script");
            script.src =
                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4986993922938185";
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = () => console.log("AdSense Script Manual Load: SUCCESS");
            script.onerror = (e) => console.error("AdSense Script Manual Load: FAILED", e);

            document.head.appendChild(script);
            console.log("AdSense script appended to head");
        } catch (err) {
            console.error("AdSense Injection Error:", err);
        }
    }, []);

    return null;
}

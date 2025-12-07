'use client';

import { useEffect } from 'react';

interface AdBannerProps {
    slot?: string;
    format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
    responsive?: boolean;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function AdBanner({
    slot = '',
    format = 'auto',
    responsive = true
}: AdBannerProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="w-full flex justify-center my-2">
            <ins
                className="adsbygoogle"
                style={{
                    display: 'block',
                    minHeight: '50px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                }}
                data-ad-client="ca-pub-4986993922938185"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}

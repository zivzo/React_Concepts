import { useEffect, useRef } from "react";
import { adsConfig } from "../config/ads";

const AD_WIDTH = 160;
const AD_HEIGHT = 600;

export default function AdSlot({ slot, side }) {
  const adRef = useRef(null);
  const hasRequestedAd = useRef(false);
  const isLive = Boolean(adsConfig.client && slot);

  useEffect(() => {
    if (!isLive || hasRequestedAd.current || adRef.current?.dataset.adsbygoogleStatus) return;
    hasRequestedAd.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or network issues should never break the learning experience.
    }
  }, [isLive]);

  if (!isLive && !adsConfig.showPlaceholders) return null;

  return (
    <aside aria-label="Advertisement" className={`ad-rail ad-rail-${side}`}>
      <span className="ad-label">Advertisement</span>
      {isLive ? (
        <ins
          className="adsbygoogle"
          data-ad-client={adsConfig.client}
          data-ad-slot={slot}
          data-adtest={adsConfig.isTestMode ? "on" : undefined}
          ref={adRef}
          style={{ display: "inline-block", width: AD_WIDTH, height: AD_HEIGHT }}
        />
      ) : (
        <div className="ad-placeholder" style={{ width: AD_WIDTH, height: AD_HEIGHT }}>
          <span>Ad space</span>
          <small>{AD_WIDTH} × {AD_HEIGHT}</small>
        </div>
      )}
    </aside>
  );
}

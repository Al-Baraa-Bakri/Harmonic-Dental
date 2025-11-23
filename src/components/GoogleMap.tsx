"use client";

import React from "react";

const GoogleMap = () => {
  // Use a generic embed URL. Users should generate their own from Google Maps "Share" -> "Embed a map"
  // and replace the src below with their specific location.
  const embedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.4095837796684!2d55.77967099751988!3d24.222418173446066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e8ab6c20c22dbb9%3A0x9c84589946709e34!2z2YjYs9i3INin2YTZhdiv2YrZhtipIC0g2K3ZiiDYp9mE2YXYsdio2LnYqSAtINij2KjZiCDYuNio2YogLSDYp9mE2KXZhdin2LHYp9iqINin2YTYudix2KjZitipINin2YTZhdiq2K3Yr9ip!5e0!3m2!1sar!2snl!4v1763289067862!5m2!1sar!2snl";

  return (
    <div className="aspect-[16/9] w-full rounded-xl bg-muted/30 border border-border/50 overflow-hidden">
      <iframe
        src={embedSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy" // Lazy load the iframe for performance
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map Location"
        className="rounded-xl transition-all duration-500"
      ></iframe>
    </div>
  );
};

export default GoogleMap;

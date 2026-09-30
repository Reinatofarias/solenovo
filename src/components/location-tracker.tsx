"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LocationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    void fetch("/api/analytics/location", {
      method: "POST", credentials: "same-origin", keepalive: true,
    });
  }, [pathname]);
  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

export default function NativeAppHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only execute on native Android runtime
    if (!Capacitor.isNativePlatform()) return;

    // Handle Android hardware back button
    const backButtonListener = CapApp.addListener("backButton", ({ canGoBack }) => {
      // If any open modal exists in DOM (e.g. trailer, actor, info, AI summary)
      const openModalCloseBtn = document.querySelector<HTMLButtonElement>(
        "[data-modal-close], .fixed button[title='Close'], .fixed button[aria-label='Close']"
      );

      if (openModalCloseBtn) {
        openModalCloseBtn.click();
        return;
      }

      // If on homepage or root, exit or minimize app
      if (pathname === "/" || !canGoBack) {
        CapApp.minimizeApp();
      } else {
        router.back();
      }
    });

    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [pathname, router]);

  return null;
}

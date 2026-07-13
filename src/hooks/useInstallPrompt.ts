import { useEffect, useState } from "react";
import {
  dismissInstallBanner,
  isIOS,
  isInstallBannerDismissed,
  isStandalone,
} from "../lib/pwa/installPrompt";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UseInstallPromptResult {
  /** true si Chrome/Edge/Android ya ofrecieron el evento nativo de instalación. */
  canInstall: boolean;
  isIOS: boolean;
  dismissed: boolean;
  promptInstall: () => Promise<void>;
  dismiss: () => void;
}

export function useInstallPrompt(): UseInstallPromptResult {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(isInstallBannerDismissed);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function promptInstall(): Promise<void> {
    if (!deferredEvent) {
      return;
    }
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
  }

  function dismiss(): void {
    dismissInstallBanner();
    setDismissed(true);
  }

  return {
    canInstall: deferredEvent !== null,
    isIOS: isIOS(),
    dismissed,
    promptInstall,
    dismiss,
  };
}

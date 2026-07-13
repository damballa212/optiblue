import { Share, Sparkles, X } from "lucide-react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import { isStandalone } from "../../lib/pwa/installPrompt";
import styles from "./InstallBanner.module.css";

export function InstallBanner() {
  const { canInstall, isIOS, dismissed, promptInstall, dismiss } = useInstallPrompt();

  if (dismissed || isStandalone() || (!canInstall && !isIOS)) {
    return null;
  }

  return (
    <div className={styles.banner} role="complementary">
      <Sparkles size={18} aria-hidden="true" />
      {isIOS ? (
        <p>
          Instala OptiBlue: toca <Share size={14} aria-hidden="true" className={styles.inlineIcon} /> Compartir y
          luego "Añadir a pantalla de inicio".
        </p>
      ) : (
        <p>Instala OptiBlue para acceder más rápido, incluso sin conexión.</p>
      )}
      <div className={styles.actions}>
        {canInstall && (
          <button type="button" className={styles.install} onClick={promptInstall}>
            Instalar
          </button>
        )}
        <button type="button" className={styles.dismiss} onClick={dismiss} aria-label="Cerrar aviso de instalación">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

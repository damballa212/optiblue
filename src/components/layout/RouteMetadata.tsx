import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = (import.meta.env.VITE_APP_URL ?? window.location.origin).replace(/\/$/, "");
const DEFAULT_DESCRIPTION = "Catálogo, lentes adaptados, servicios visuales y sedes de OptiBlue en Venezuela.";

const ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  "/": { title: "OptiBlue | Óptica y oftalmología en Venezuela", description: DEFAULT_DESCRIPTION },
  "/catalogo": { title: "Catálogo de monturas | OptiBlue", description: "Consulta el catálogo disponible de monturas y productos OptiBlue." },
  "/lentes": { title: "Lentes adaptados | OptiBlue", description: "Solicita una cotización de lentes adaptados con tu fórmula óptica." },
  "/servicios": { title: "Servicios visuales | OptiBlue", description: "Conoce los servicios visuales disponibles y solicita una cita en OptiBlue." },
  "/sedes": { title: "Sedes | OptiBlue", description: "Consulta la información disponible de las sedes OptiBlue." },
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname.startsWith("/admin");
    const metadata = ROUTE_METADATA[pathname] ?? {
      title: "OptiBlue",
      description: isAdmin ? "Panel administrativo de OptiBlue." : DEFAULT_DESCRIPTION,
    };
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = isAdmin ? "Administración | OptiBlue" : metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", isAdmin ? "noindex,nofollow" : "index,follow");
    setMeta("property", "og:title", isAdmin ? "Administración | OptiBlue" : metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:url", canonicalUrl);
    setCanonical(canonicalUrl);
  }, [pathname]);

  return null;
}

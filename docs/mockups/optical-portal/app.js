const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const phase = (progress, start, end) => clamp((progress - start) / (end - start));

const story = document.querySelector("[data-portal-story]");
const stage = document.querySelector("[data-portal-stage]");
const sceneNumber = document.querySelector("[data-scene-number]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let frameRequested = false;

function updatePortal() {
  frameRequested = false;
  if (!story || !stage || reducedMotion.matches) return;

  const rect = story.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - stage.offsetHeight);
  const progress = clamp(-rect.top / scrollable);
  const open = phase(progress, 0.05, 0.37);
  const copyOut = phase(progress, 0.16, 0.34);
  const pathsIn = phase(progress, 0.28, 0.43);
  const pathsOut = phase(progress, 0.49, 0.63);
  const paths = pathsIn * (1 - pathsOut);
  const split = phase(progress, 0.3, 0.58);
  const citiesIn = phase(progress, 0.56, 0.7) * (1 - phase(progress, 0.74, 0.84));
  const exit = phase(progress, 0.8, 0.98);

  stage.style.setProperty("--p-open", open.toFixed(4));
  stage.style.setProperty("--p-copy-out", copyOut.toFixed(4));
  stage.style.setProperty("--p-paths", paths.toFixed(4));
  stage.style.setProperty("--p-split", split.toFixed(4));
  stage.style.setProperty("--p-cities", citiesIn.toFixed(4));
  stage.style.setProperty("--p-exit", exit.toFixed(4));

  const scene = progress < 0.28 ? "01" : progress < 0.56 ? "02" : progress < 0.8 ? "03" : "04";
  if (sceneNumber) sceneNumber.textContent = scene;
}

function requestPortalUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(updatePortal);
}

window.addEventListener("scroll", requestPortalUpdate, { passive: true });
window.addEventListener("resize", requestPortalUpdate);
reducedMotion.addEventListener("change", requestPortalUpdate);
updatePortal();

const rail = document.querySelector("[data-campaign-rail]");
const railProgress = document.querySelector("[data-rail-progress]");
const previous = document.querySelector("[data-rail-prev]");
const next = document.querySelector("[data-rail-next]");
const campaignSection = document.querySelector(".campaigns");
const requestedCount = Number(new URLSearchParams(window.location.search).get("campaigns"));
const campaignCount = [1, 2, 4].includes(requestedCount) ? requestedCount : 4;

rail?.querySelectorAll(".campaign").forEach((campaign, index) => {
  campaign.hidden = index >= campaignCount;
});
campaignSection?.setAttribute("data-campaign-count", String(campaignCount));

function updateRailProgress() {
  if (!rail || !railProgress) return;
  const max = Math.max(1, rail.scrollWidth - rail.clientWidth);
  const progress = clamp(rail.scrollLeft / max);
  railProgress.style.setProperty("--rail-progress", String(0.34 + progress * 0.66));
  if (previous) previous.disabled = rail.scrollLeft <= 1;
  if (next) next.disabled = rail.scrollLeft >= max - 1 || max <= 1;
}

function scrollRail(direction) {
  if (!rail) return;
  const card = rail.querySelector(".campaign");
  const amount = card ? card.getBoundingClientRect().width + 14 : rail.clientWidth * 0.8;
  rail.scrollBy({ left: direction * amount, behavior: reducedMotion.matches ? "auto" : "smooth" });
}

previous?.addEventListener("click", () => scrollRail(-1));
next?.addEventListener("click", () => scrollRail(1));
rail?.addEventListener("scroll", updateRailProgress, { passive: true });
updateRailProgress();

const menuOpen = document.querySelector("[data-menu-open]");
const menuClose = document.querySelector("[data-menu-close]");
const drawerOverlay = document.querySelector("[data-drawer-overlay]");
const drawerFocusables = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

function closeMenu() {
  if (!drawerOverlay || !menuOpen) return;
  drawerOverlay.hidden = true;
  menuOpen.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  menuOpen.focus();
}

function openMenu() {
  if (!drawerOverlay || !menuOpen) return;
  drawerOverlay.hidden = false;
  menuOpen.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  menuClose?.focus();
}

menuOpen?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
drawerOverlay?.addEventListener("mousedown", (event) => {
  if (event.target === drawerOverlay) closeMenu();
});
drawerOverlay?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (!drawerOverlay || drawerOverlay.hidden) return;
  if (event.key === "Escape") {
    closeMenu();
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = [...drawerOverlay.querySelectorAll(drawerFocusables)];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768 && drawerOverlay && !drawerOverlay.hidden) closeMenu();
});

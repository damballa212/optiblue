export const HERO_SCENE_TARGETS = [0, 0.44, 0.72, 1] as const;

export type HeroScene = 0 | 1 | 2 | 3;
export type HeroDirection = -1 | 1;
export type HeroBoundary = "before" | "after" | null;

export interface HeroStepResult {
  scene: HeroScene;
  boundary: HeroBoundary;
}

const isHeroScene = (value: number): value is HeroScene => (
  Number.isInteger(value) && value >= 0 && value < HERO_SCENE_TARGETS.length
);

export class HeroStepperController {
  private currentScene: HeroScene;
  private transitionComplete = true;
  private gestureComplete = true;

  constructor(initialScene: HeroScene = 0) {
    this.currentScene = initialScene;
  }

  get scene() {
    return this.currentScene;
  }

  request(direction: HeroDirection): HeroStepResult | null {
    if (!this.transitionComplete || !this.gestureComplete) return null;

    this.transitionComplete = false;
    this.gestureComplete = false;

    const requestedScene = this.currentScene + direction;

    if (requestedScene < 0) {
      return { scene: this.currentScene, boundary: "before" };
    }

    if (requestedScene >= HERO_SCENE_TARGETS.length) {
      return { scene: this.currentScene, boundary: "after" };
    }

    if (!isHeroScene(requestedScene)) return null;

    this.currentScene = requestedScene;
    return { scene: this.currentScene, boundary: null };
  }

  completeTransition() {
    this.transitionComplete = true;
  }

  completeGesture() {
    this.gestureComplete = true;
  }

  reset(scene: HeroScene) {
    this.currentScene = scene;
    this.transitionComplete = true;
    this.gestureComplete = true;
  }
}

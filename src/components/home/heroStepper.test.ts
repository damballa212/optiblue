import { describe, expect, it } from "vitest";
import {
  HERO_SCENE_TARGETS,
  HeroStepperController,
  type HeroStepResult,
} from "./heroStepper";

const completeIntent = (controller: HeroStepperController) => {
  controller.completeTransition();
  controller.completeGesture();
};

describe("HeroStepperController", () => {
  it("expone cuatro estados visuales estables", () => {
    expect(HERO_SCENE_TARGETS).toEqual([0, 0.44, 0.72, 1]);
  });

  it("avanza exactamente una escena por intención", () => {
    const controller = new HeroStepperController();

    expect(controller.request(1)).toEqual<HeroStepResult>({ scene: 1, boundary: null });
    expect(controller.scene).toBe(1);
  });

  it("ignora el momentum hasta que terminan gesto y transición", () => {
    const controller = new HeroStepperController();

    expect(controller.request(1)?.scene).toBe(1);
    expect(controller.request(1)).toBeNull();

    controller.completeTransition();
    expect(controller.request(1)).toBeNull();

    controller.completeGesture();
    expect(controller.request(1)?.scene).toBe(2);
  });

  it("también conserva el bloqueo si el gesto termina antes que la transición", () => {
    const controller = new HeroStepperController();

    expect(controller.request(1)?.scene).toBe(1);
    controller.completeGesture();
    expect(controller.request(1)).toBeNull();

    controller.completeTransition();
    expect(controller.request(1)?.scene).toBe(2);
  });

  it("recorre las escenas en sentido inverso", () => {
    const controller = new HeroStepperController(3);

    expect(controller.request(-1)).toEqual<HeroStepResult>({ scene: 2, boundary: null });
    completeIntent(controller);
    expect(controller.request(-1)).toEqual<HeroStepResult>({ scene: 1, boundary: null });
  });

  it("libera el scroll en ambos límites sin alterar la escena", () => {
    const first = new HeroStepperController(0);
    const last = new HeroStepperController(3);

    expect(first.request(-1)).toEqual<HeroStepResult>({ scene: 0, boundary: "before" });
    expect(last.request(1)).toEqual<HeroStepResult>({ scene: 3, boundary: "after" });
    expect(first.scene).toBe(0);
    expect(last.scene).toBe(3);
  });

  it("permite reiniciar el estado sin conservar locks anteriores", () => {
    const controller = new HeroStepperController();

    controller.request(1);
    controller.reset(3);

    expect(controller.scene).toBe(3);
    expect(controller.request(-1)?.scene).toBe(2);
  });
});

// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { pedidosApi } from "../lib/api/pedidos";
import type { Pedido } from "../types";
import { usePedidos } from "./usePedidos";

vi.mock("../lib/api/pedidos", () => ({
  pedidosApi: { listarPedidos: vi.fn() },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const older: Pedido = {
  id: "older",
  nombre: "Anterior",
  telefono: "1",
  sedeId: "s1",
  productoId: "p1",
  precio: 10,
  estado: "pendiente",
  fecha: "2026-07-11",
};
const latest: Pedido = { ...older, id: "latest", nombre: "Reciente" };

describe("usePedidos", () => {
  beforeEach(() => vi.mocked(pedidosApi.listarPedidos).mockReset());

  it("ignora una respuesta anterior que llega despues del refetch mas reciente", async () => {
    const first = deferred<Pedido[]>();
    const second = deferred<Pedido[]>();
    vi.mocked(pedidosApi.listarPedidos)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { result } = renderHook(() => usePedidos());
    await waitFor(() =>
      expect(pedidosApi.listarPedidos).toHaveBeenCalledTimes(1),
    );

    let refresh!: Promise<void>;
    act(() => {
      refresh = result.current.refetch();
    });
    await waitFor(() =>
      expect(pedidosApi.listarPedidos).toHaveBeenCalledTimes(2),
    );
    second.resolve([latest]);
    await act(async () => {
      await refresh;
    });
    expect(result.current.pedidos).toEqual([latest]);

    first.resolve([older]);
    await act(async () => {
      await first.promise;
    });
    expect(result.current.pedidos).toEqual([latest]);
  });
});

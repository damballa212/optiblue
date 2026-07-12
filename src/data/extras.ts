import type { ExtraLente } from "../types";

export const EXTRAS_LENTES: ExtraLente[] = [
  { key: "fotocromatico", label: "Fotocromático", precio: 20, desc: "Tratamiento que cambia de tono con la luz" },
  { key: "filtroazul", label: "Filtro de luz azul", precio: 15, desc: "Tratamiento con filtro de luz azul" },
  { key: "antirreflejo", label: "Antirreflejo", precio: 10, desc: "Tratamiento para reducir reflejos" },
  { key: "ultrafino", label: "Lente ultrafino", precio: 25, desc: "Opción de lente con índice 1.67" },
];

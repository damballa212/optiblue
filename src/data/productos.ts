import type { Producto } from "../types";

export const INITIAL_PRODUCTS: Producto[] = [
  { id: 1, nombre: "Montura Classic Pro", categoria: "monturas", precio: 45, imagen: "👓", descripcion: "Marco acetato premium, ligero y duradero. Disponible en negro, tortuga y azul.", stock: 12, destacado: true },
  { id: 2, nombre: "Montura Slim Line", categoria: "monturas", precio: 38, imagen: "🕶", descripcion: "Armazón metálico ultra-delgado. Estilo minimalista para uso diario.", stock: 8, destacado: false },
  { id: 3, nombre: "Montura Kids Fun", categoria: "monturas", precio: 30, imagen: "👓", descripcion: "Flexible y resistente para niños. Colores vibrantes y ajuste seguro.", stock: 15, destacado: false },
  { id: 4, nombre: "Solar Aviator UV400", categoria: "solares", precio: 55, imagen: "🕶", descripcion: "Protección UV400 total. Lente polarizada, marco dorado.", stock: 10, destacado: true },
  { id: 5, nombre: "Solar Deportivo Xtreme", categoria: "solares", precio: 62, imagen: "🥽", descripcion: "Wrap-around para actividades al aire libre. Antideslizante.", stock: 6, destacado: false },
  { id: 6, nombre: "Solar Cat Eye", categoria: "solares", precio: 50, imagen: "🕶", descripcion: "Estilo retro femenino. Degradado espejo con protección total.", stock: 9, destacado: false },
  { id: 7, nombre: "Sport Running Elite", categoria: "deporte", precio: 70, imagen: "🥽", descripcion: "Para corredores. Lente intercambiable, ultra-ligero.", stock: 5, destacado: true },
  { id: 8, nombre: "Sport Ciclismo Pro", categoria: "deporte", precio: 80, imagen: "🥽", descripcion: "Aerodinámica, ventilación lateral, antivaho.", stock: 4, destacado: false },
];

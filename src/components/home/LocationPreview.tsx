import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useSedes } from "../../hooks/useSedes";
import { DataState } from "../shared/DataState";
import styles from "./LocationPreview.module.css";

const REAL_CITIES = ["Barinas", "Acarigua", "Barquisimeto"];
const isDefined = (value: string) => value.trim().length > 0 && !value.toLowerCase().includes("por definir");

export function LocationPreview() {
  const { sedes, loading, error } = useSedes();
  const ordered = REAL_CITIES.map((city) => sedes.find((sede) => sede.ciudad.toLowerCase() === city.toLowerCase())).filter(Boolean);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div><span>Sedes</span><h2>Tres ciudades, atención local.</h2></div>
        <Link to="/sedes">Ver todas las sedes <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      {loading && <DataState kind="loading" title="Cargando sedes" message="Consultando datos disponibles." />}
      {!loading && error && <DataState kind="error" title="No pudimos cargar las sedes" message="Puedes volver a intentarlo desde la página de sedes." />}
      {!loading && !error && (
        <div className={styles.grid}>
          {REAL_CITIES.map((city) => {
            const sede = ordered.find((item) => item?.ciudad.toLowerCase() === city.toLowerCase());
            return (
              <article key={city}>
                <span className={styles.cityLabel}>Sede</span>
                <h3>{city}</h3>
                <div><MapPin size={17} aria-hidden="true" /><span>{sede && isDefined(sede.direccion) ? sede.direccion : "Dirección por confirmar"}</span></div>
                <div><Clock3 size={17} aria-hidden="true" /><span>{sede && isDefined(sede.horario) ? sede.horario : "Horario por confirmar"}</span></div>
                <Link to="/sedes">Consultar sede <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

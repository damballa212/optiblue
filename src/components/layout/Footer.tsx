import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useSedes } from "../../hooks/useSedes";
import { BrandMark } from "../brand/BrandMark";
import styles from "./Footer.module.css";

const isDefined = (value: string) => value.trim().length > 0 && !value.toLowerCase().includes("por definir");

export function Footer() {
  const { sedes, loading, error } = useSedes();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <BrandMark inverse />
            <p>Óptica y oftalmología con atención en Barinas, Acarigua y Barquisimeto.</p>
            <Link to="/lentes" className={styles.assistance}>
              <MessageCircle size={17} aria-hidden="true" /> Solicitar asesoría
            </Link>
          </div>
          <div>
            <h2>Explorar</h2>
            <nav className={styles.links} aria-label="Navegación del pie de página">
              <Link to="/catalogo">Catálogo</Link>
              <Link to="/lentes">Lentes adaptados</Link>
              <Link to="/servicios">Servicios</Link>
              <Link to="/sedes">Sedes</Link>
            </nav>
          </div>
          <div>
            <h2>Sedes</h2>
            <div className={styles.locationList}>
              {loading && <span>Consultando sedes...</span>}
              {!loading && error && <span>Barinas · Acarigua · Barquisimeto</span>}
              {!loading && !error && sedes.length === 0 && <span>Barinas · Acarigua · Barquisimeto</span>}
              {!loading && !error && sedes.map((sede) => <span key={sede.id}><MapPin size={15} aria-hidden="true" /> {sede.ciudad}</span>)}
            </div>
          </div>
          <div>
            <h2>Contacto por sede</h2>
            <div className={styles.contactList}>
              {sedes.some((sede) => isDefined(sede.telefono)) && <span><Phone size={15} aria-hidden="true" /> Teléfonos disponibles en Sedes</span>}
              {sedes.some((sede) => isDefined(sede.horario)) && <span><Clock3 size={15} aria-hidden="true" /> Horarios disponibles por sede</span>}
              <span><MessageCircle size={15} aria-hidden="true" /> Solicitudes registradas antes de WhatsApp</span>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© {year} OptiBlue</span>
          <span>Barinas · Acarigua · Barquisimeto</span>
        </div>
      </div>
    </footer>
  );
}

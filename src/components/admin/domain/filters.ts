export interface AdminFilterState {
  query: string;
  estado: string;
  sedeId: string;
}

interface FilterableAdminRecord {
  nombre: string;
  telefono: string;
  estado: string;
  sedeId: string;
}

export function normalizeAdminSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function filterAdminRecords<T extends FilterableAdminRecord>(records: T[], filters: AdminFilterState): T[] {
  const compact = (value: string) => normalizeAdminSearch(value).replace(/[^a-z0-9]/g, "");
  const query = compact(filters.query);
  return records.filter((record) => {
    const haystack = compact(`${record.nombre} ${record.telefono}`);
    const matchesQuery = !query || haystack.includes(query);
    const matchesState = filters.estado === "todos" || record.estado === filters.estado;
    const matchesLocation = filters.sedeId === "todas" || record.sedeId === filters.sedeId;
    return matchesQuery && matchesState && matchesLocation;
  });
}

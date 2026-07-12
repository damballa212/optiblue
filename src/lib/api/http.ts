interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiRequest<T>(baseUrl: string, path: string, options?: RequestInit, authenticated = false): Promise<T> {
  const token = authenticated
    ? await import("../auth/firebaseAuth").then(({ auth }) => auth.currentUser?.getIdToken())
    : undefined;
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error ?? "Error de red al comunicarse con el servidor");
  }
  return body.data as T;
}

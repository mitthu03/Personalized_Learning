const API_BASE =
  import.meta.env.VITE_DJANGO_API_BASE_URL || "http://localhost:8000/api";

export async function api(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const result = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!result.ok) {
    const data = await result.json().catch(() => ({}));
    if (result.status === 401 && options.token) {
      localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("auth-expired"));
    }
    throw new Error(data.detail || "Request failed.");
  }
  return result.json();
}

export { API_BASE };

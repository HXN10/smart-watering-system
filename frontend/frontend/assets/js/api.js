const API_BASE = "http://localhost:3001";

async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("token");
  const defaultHeaders = { "Content-Type": "application/json" };
  if (token) {
    defaultHeaders.Authorization = token;
  }

  try {
    const res = await fetch(API_BASE + path, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch (e) {
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      throw new Error("Invalid response from server");
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed: ${res.status}`);
    }
    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Make sure the backend is running on http://localhost:3001");
    }
    throw error;
  }
}

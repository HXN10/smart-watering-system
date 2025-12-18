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

    // Check if response is ok before trying to parse JSON
    let data;
    try {
      data = await res.json();
    } catch (e) {
      // If response is not JSON, check status
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
    // Handle network errors
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Make sure the backend is running on http://localhost:3001");
    }
    throw error;
  }
}

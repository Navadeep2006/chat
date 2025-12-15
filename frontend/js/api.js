const API_URL = "http://localhost:5000/api";

async function apiCall(endpoint, method, data, token) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: data ? JSON.stringify(data) : null
  });
  return res.json();
}

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "/api";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (!url.endsWith("/api") && !url.includes("/api/")) {
      url = `${url.replace(/\/+$/, "")}/api`;
    }
  }
  return url;
};

const API_BASE_URL = getBaseUrl();

export const getAuthToken = () => {
  return localStorage.getItem("accessToken") || "";
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is not FormData, add Content-Type: application/json
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  // Format clean endpoint URL without duplicating /api
  let cleanEndpoint = endpoint || "";
  if (cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.substring(4);
  }

  const fullUrl = API_BASE_URL.endsWith("/") 
    ? `${API_BASE_URL}${cleanEndpoint.startsWith("/") ? cleanEndpoint.substring(1) : cleanEndpoint}`
    : `${API_BASE_URL}${cleanEndpoint.startsWith("/") ? cleanEndpoint : "/" + cleanEndpoint}`;

  try {
    const response = await fetch(fullUrl, config);

    // If 401 Unauthorized, attempt token refresh if available
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken || refreshData.token;
          if (newToken) {
            setAuthToken(newToken);
            headers["Authorization"] = `Bearer ${newToken}`;
            const retryRes = await fetch(fullUrl, { ...config, headers });
            return await retryRes.json();
          }
        } else {
          setAuthToken("");
        }
      } catch (err) {
        setAuthToken("");
      }
    }

    // Safely parse JSON or text response
    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = {
        success: false,
        message: text || `Server returned status ${response.status}`
      };
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

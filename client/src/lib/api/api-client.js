


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

let tokenCache = null;
let tokenPromise = null;
let tokenExpiry = 0;

const MAX_RETRIES = 3; // Increased from 2 to 3
const RETRY_DELAY = 1000; // 1 second
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createAuthenticatedApiRequest(getToken) {
  const refreshToken = async () => {
    try {

      if (tokenPromise) {
        return await tokenPromise;
      }

      if (tokenCache && Date.now() >= tokenExpiry) {
        tokenCache = null;
        tokenExpiry = 0;
      }

      tokenPromise = getToken();
      const newToken = await tokenPromise;

      if (!newToken) {
        throw new Error("Failed to get authentication token");
      }

      tokenCache = newToken;
      tokenExpiry = Date.now() + TOKEN_EXPIRY_BUFFER;
      tokenPromise = null;
      return newToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      tokenPromise = null;
      tokenCache = null;
      tokenExpiry = 0;
      throw error;
    }
  };

  return async function authenticatedApiRequest(
    url,
    options = {},
    retryCount = 0
  ) {
    try {
      let authToken = null;

      if (retryCount === 0 || !tokenCache || Date.now() >= tokenExpiry) {
        authToken = await refreshToken();
      } else {
        authToken = tokenCache;
      }

      if (!authToken) {
        throw new Error("No authentication token available");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {

          clearTokenCache();

          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying request (attempt ${retryCount + 1})`);
            await delay(RETRY_DELAY * (retryCount + 1));
            return authenticatedApiRequest(url, options, retryCount + 1);
          }

          throw new Error(
            "Authentication failed after multiple attempts. Please sign in again."
          );
        }

        const errorData = await response.json().catch(() => ({
          error: `API request failed: ${response.status}`,
        }));
        throw new Error(
          errorData.error || `API request failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      if (
        error.message.includes("Authentication") ||
        error.message.includes("token") ||
        error.status === 401
      ) {
        clearTokenCache();
      }
      throw error;
    }
  };
}

export function clearTokenCache() {
  console.log("Clearing token cache");
  tokenCache = null;
  tokenExpiry = 0;
  tokenPromise = null;
}

export async function apiRequest(url, options = {}, retryCount = 0) {
  try {
    let authToken = null;

    if (typeof window !== "undefined") {
      const now = Date.now();
      if (tokenCache && now < tokenExpiry) {
        authToken = tokenCache;
      } else {
        try {
          if (tokenPromise) {
            authToken = await tokenPromise;
          } else {
            const { getToken } = await import("@clerk/nextjs");
            tokenPromise = getToken();
            authToken = await tokenPromise;

            tokenCache = authToken;
            tokenExpiry = now + 4.5 * 60 * 1000; // 4.5 minutes to be safe
            tokenPromise = null;
          }
        } catch (error) {
          console.warn("Could not get auth token:", error);
          tokenPromise = null;
          throw error;
        }
      }
    }

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers,
      ...options,
    });

    if (!response.ok) {

      if (response.status === 401) {
        clearTokenCache();

        if (retryCount < MAX_RETRIES) {
          await delay(RETRY_DELAY * (retryCount + 1));
          return apiRequest(url, options, retryCount + 1);
        }

        throw new Error(
          "Authentication failed after multiple attempts. Please sign in again."
        );
      }

      let errorMessage = `API request failed: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {

      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (
      error.message.includes("multiple attempts") ||
      (error.message.includes("Authentication") && retryCount >= MAX_RETRIES)
    ) {
      clearTokenCache();
    }
    console.error("API request error:", error);
    throw error;
  }
}

export { API_BASE_URL };

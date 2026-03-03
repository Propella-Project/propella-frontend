// PROPELLA API Client
const API_BASE_URL = ""; // Always empty – use relative URLs

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  status?: number;
}

// Type for login response
interface LoginResponse {
  access: string;
  refresh: string;
}

// Type for registration
interface RegisterData {
  email: string;
  password: string;
  username?: string;
}

// Type for exam profile creation
interface ExamProfileData {
  firstName: string;
  writingJamb: string;
  subjects?: string[];
  phone?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => ({}));

    // Build a friendly error message if the response is not OK
    let errorMessage: string | undefined;
    if (!response.ok) {
      // Try to extract a meaningful error from the response body
      if (data.email && Array.isArray(data.email) && data.email.length > 0) {
        // Field error: e.g., "user with this Email already exists."
        errorMessage = data.email[0];
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === "object" && Object.keys(data).length > 0) {
        // If there are other field errors, pick the first one
        const firstField = Object.keys(data).find(
          (key) => Array.isArray(data[key]) && data[key].length > 0,
        );
        if (firstField) {
          errorMessage = data[firstField][0];
        } else {
          // Fallback: stringify the entire error object
          errorMessage = JSON.stringify(data);
        }
      } else {
        errorMessage = `HTTP ${response.status}`;
      }
    }

    return {
      success: response.ok,
      message: data.message,
      data: response.ok ? data : undefined,
      error: errorMessage,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

// Auth
export async function login(credentials: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/api/accounts/token/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function refreshToken(refresh: string) {
  return apiFetch<{ access: string }>("/api/accounts/token/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

// Registration & Verification
export async function registerUser(data: RegisterData) {
  return apiFetch("/api/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyEmail(data: { email: string; code: string }) {
  return apiFetch("/api/accounts/verify-email/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resendCode(email: string) {
  return apiFetch("/api/accounts/resend-code/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// User management (authenticated)
export async function getAllUsers() {
  return apiFetch("/api/accounts/all-users/", { method: "GET" });
}

export async function editUser(userId: number, data: any) {
  return apiFetch(`/api/accounts/edit-user/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Exam Profile (authenticated)
export async function createExamProfile(data: ExamProfileData) {
  return apiFetch("/api/accounts/create-exam-profile/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function editExamProfile(profileId: number, data: any) {
  return apiFetch(`/api/accounts/edit-exam-profile/${profileId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

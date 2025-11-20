import type { Property, Agent } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: response.statusText,
    }));
    throw new ApiError(response.status, error.error || error.message || "Request failed");
  }

  return response.json();
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export const propertiesApi = {
  async getAll() {
    return apiFetch<{ items: Property[] }>("/api/properties");
  },
  async getById(id: string) {
    return apiFetch<{ property: Property }>(`/api/properties/${id}`);
  },
  async create(data: Partial<Property>) {
    return apiFetch<{ property: Property }>("/api/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  async update(id: string, data: Partial<Property>) {
    return apiFetch<{ property: Property }>(`/api/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  async delete(id: string) {
    return apiFetch<{ message: string }>(`/api/properties/${id}`, {
      method: "DELETE",
    });
  },
};

export const agentsApi = {
  async getAll() {
    return apiFetch<{ items: Agent[] }>("/api/agents");
  },
  async getById(id: string) {
    return apiFetch<Agent>(`/api/agents/${id}`);
  },
};

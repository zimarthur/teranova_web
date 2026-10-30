import { userFacingError, type ApiErrorBody } from "@/shared/api/errors";
import { sessionStore } from "@/shared/api/sessionStore";

const apiUrl = () =>
  (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export class HttpError extends Error {
  status: number;
  code?: string;
  plan?: string;
  action?: string;

  constructor(message: string, status: number, body: ApiErrorBody = {}) {
    super(message);
    this.status = status;
    this.code = body.code;
    this.plan = body.plan;
    this.action = body.action;
  }
}

type HttpOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
  auth?: boolean;
  clinic?: boolean;
  retry?: boolean;
};

let refreshing: Promise<boolean> | null = null;

const refreshSession = async () => {
  const refreshToken = sessionStore.getRefresh();
  if (!refreshToken) return false;
  const response = await fetch(`${apiUrl()}/auth/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  if (!response.ok) {
    sessionStore.clear();
    return false;
  }
  const payload = (await response.json()) as {
    data?: { accessToken?: string; refreshToken?: string };
  };
  const access = payload.data?.accessToken;
  const refresh = payload.data?.refreshToken;
  if (!access || !refresh) {
    sessionStore.clear();
    return false;
  }
  sessionStore.setSession(access, refresh);
  return true;
};

const ensureAccess = async () => {
  if (sessionStore.getAccess()) return true;
  if (!sessionStore.getRefresh()) return false;
  refreshing ??= refreshSession().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

export const http = async <T>(path: string, options: HttpOptions = {}): Promise<T> => {
  const { auth = true, clinic = true, retry = true, body, headers, ...rest } = options;

  if (auth && !sessionStore.getAccess()) {
    const ok = await ensureAccess();
    if (!ok) throw new HttpError("Sessão expirada. Faça login novamente.", 401);
  }

  const requestHeaders = new Headers(headers);
  if (auth) {
    const access = sessionStore.getAccess();
    if (access) requestHeaders.set("Authorization", `Bearer ${access}`);
  }
  if (clinic) {
    const clinicId = sessionStore.getClinicId();
    if (clinicId) requestHeaders.set("X-Clinic-Id", clinicId);
  }

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body != null) {
    requestHeaders.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${apiUrl()}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: payload,
  });

  if (response.status === 401 && auth && retry) {
    const renewed = await refreshSession();
    if (renewed) return http<T>(path, { ...options, retry: false });
    throw new HttpError("Sessão expirada. Faça login novamente.", 401);
  }

  const parsed = (await response.json().catch(() => ({}))) as ApiErrorBody & {
    data?: T;
    status?: string;
  };

  if (!response.ok) {
    throw new HttpError(userFacingError(path, response.status, parsed), response.status, parsed);
  }

  if (parsed && typeof parsed === "object" && "data" in parsed && parsed.data !== undefined) {
    return parsed.data as T;
  }
  return parsed as T;
};

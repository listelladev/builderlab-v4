"use client";

export class AdminApiError extends Error {
  errors?: string[];
  status: number;
  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type AdminApiOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | unknown[];
};

export async function adminApi<T = unknown>(
  path: string,
  options?: AdminApiOptions
): Promise<T> {
  const opts: RequestInit = { credentials: "same-origin", ...options } as RequestInit;
  if (opts.body && !(opts.body instanceof FormData) && typeof opts.body !== "string") {
    opts.headers = { "Content-Type": "application/json", ...(opts.headers as Record<string, string>) };
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(path, opts);

  if (res.status === 401 && path !== "/api/auth/login" && path !== "/api/auth/session") {
    // Hard navigation is deliberate here (session expiry): this is a plain
    // utility outside the component tree, with no router to push through,
    // and a full reload is what we want anyway to clear client state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/admin/login";
    throw new AdminApiError("Not authenticated", 401);
  }

  let data: Record<string, unknown> | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = (data && typeof data.error === "string" && data.error) || "Request failed.";
    const errors = data && Array.isArray(data.errors) ? (data.errors as string[]) : undefined;
    throw new AdminApiError(message, res.status, errors);
  }

  return data as T;
}

export async function uploadImage(file: File, alt?: string) {
  const fd = new FormData();
  fd.append("file", file);
  if (alt) fd.append("alt", alt);
  return adminApi<{ image: { _type: "image"; asset: { _type: "reference"; _ref: string }; alt?: string }; asset: { _id: string; url: string } }>(
    "/api/admin/upload",
    { method: "POST", body: fd }
  );
}

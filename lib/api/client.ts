import createClient from "openapi-fetch";
import type { paths } from "./schema";

const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";
const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL =
  nextPublicApiUrl ??
  (isDevelopment || !isBrowser
    ? "http://localhost:3000"
    : (() => {
        throw new Error("NEXT_PUBLIC_API_URL is required in the browser");
      })());

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
  fetch: (request) => fetch(request),
});

export type ApiClient = typeof apiClient;

import createClient from "openapi-fetch";
import type { paths } from "./schema";

const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_BASE_URL =
  nextPublicApiUrl ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : (() => {
        throw new Error("NEXT_PUBLIC_API_URL is required outside development");
      })());

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

export type ApiClient = typeof apiClient;

/**
 * Shared contract between the registration form (App.tsx) and the API (api/subscribe.ts).
 * If you rename a field here, TypeScript will surface the break in BOTH places at build time.
 */
export interface RegistrationPayload {
  firstName: string;
  email: string;
}

export interface RegistrationResponse {
  success: boolean;
  error?: string;
}

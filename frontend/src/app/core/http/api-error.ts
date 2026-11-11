import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  readonly message: string;
  readonly fieldErrors: Readonly<Record<string, string>>;
}

const NETWORK_ERROR_MESSAGE = 'Le serveur est injoignable. Vérifiez que l’API est démarrée, puis réessayez.';
const UNKNOWN_ERROR_MESSAGE = 'Une erreur inattendue est survenue. Réessayez plus tard.';

interface ProblemDetail {
  readonly detail?: string;
  readonly errors?: Record<string, string>;
}

/**
 * Convertit une erreur HTTP (réponse « Problem Details » de l'API) en message lisible.
 */
export function toApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { message: UNKNOWN_ERROR_MESSAGE, fieldErrors: {} };
  }
  if (error.status === 0) {
    return { message: NETWORK_ERROR_MESSAGE, fieldErrors: {} };
  }

  const problem = (error.error ?? {}) as ProblemDetail;
  return {
    message: problem.detail ?? UNKNOWN_ERROR_MESSAGE,
    fieldErrors: problem.errors ?? {},
  };
}

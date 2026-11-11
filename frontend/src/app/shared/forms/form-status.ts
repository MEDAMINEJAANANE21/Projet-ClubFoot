export interface FormStatus {
  readonly type: 'success' | 'error';
  readonly message: string;
}

export function invalidFormStatus(): FormStatus {
  return { type: 'error', message: 'Certains champs sont à corriger' };
}

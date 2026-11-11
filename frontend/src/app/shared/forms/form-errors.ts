import { AbstractControl, FormGroup } from '@angular/forms';

type MessageFactory = (details: unknown) => string;

const ERROR_MESSAGES: Readonly<Record<string, MessageFactory>> = {
  required: () => 'Ce champ est obligatoire',
  requiredTrue: () => 'Cochez cette case pour continuer',
  email: () => 'Adresse e-mail invalide (exemple : nom@domaine.com)',
  phone: () => 'Numéro invalide (exemple : 06 12 34 56 78 ou +212 6 12 34 56 78)',
  minlength: (details) => {
    const { requiredLength, actualLength } = details as { requiredLength: number; actualLength: number };
    return `Au moins ${requiredLength} caractères (actuellement ${actualLength})`;
  },
  maxlength: (details) => `${(details as { requiredLength: number }).requiredLength} caractères maximum`,
  ageRange: (details) => {
    const { min, max } = details as { min: number; max: number };
    return `L'âge doit être compris entre ${min} et ${max} ans`;
  },
  atLeastOne: () => 'Cochez au moins une option',
  server: (details) => String(details),
};

export function shouldShowError(control: AbstractControl): boolean {
  return control.invalid && control.touched;
}

export function errorMessage(control: AbstractControl): string | null {
  if (!shouldShowError(control) || !control.errors) {
    return null;
  }
  const [key, details] = Object.entries(control.errors)[0];
  return ERROR_MESSAGES[key]?.(details) ?? 'Valeur invalide';
}

/** Affiche sous chaque champ les erreurs de validation renvoyées par l'API. */
export function applyServerErrors(form: FormGroup, fieldErrors: Readonly<Record<string, string>>): void {
  for (const [field, message] of Object.entries(fieldErrors)) {
    const control = form.get(field);
    control?.setErrors({ server: message });
    control?.markAsTouched();
  }
}

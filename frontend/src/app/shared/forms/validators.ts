import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateurs personnalisés.
 * Pattern utilisé : Strategy — chaque validateur est une règle interchangeable
 * que l'on branche sur un champ, sans toucher au formulaire lui-même.
 */

// Même règle que côté API : 06 12 34 56 78 ou +212 6 12 34 56 78.
export const PHONE_PATTERN = /^(\+\d{2,3}\s?|0)(\d[\s.-]?){8}\d$/;

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value?.trim();
    return !value || PHONE_PATTERN.test(value) ? null : { phone: true };
  };
}

export function computeAge(birthDate: Date, today: Date): number {
  const age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  return hasHadBirthday ? age : age - 1;
}

export function ageRangeValidator(min: number, max: number, today: () => Date = () => new Date()): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const birthDate = new Date(control.value);
    const age = computeAge(birthDate, today());
    const isValid = !Number.isNaN(age) && birthDate <= today() && age >= min && age <= max;
    return isValid ? null : { ageRange: { min, max } };
  };
}

export function atLeastOneChecked(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const values = Object.values((group as FormGroup).controls).map((control) => control.value);
    return values.some(Boolean) ? null : { atLeastOne: true };
  };
}

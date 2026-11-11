const INVALID_FIELD_SELECTOR = 'input.ng-invalid, select.ng-invalid, textarea.ng-invalid';

/** Place le curseur sur le premier champ invalide pour que l'utilisateur sache quoi corriger. */
export function focusFirstInvalidField(root: HTMLElement): void {
  root.querySelector<HTMLElement>(INVALID_FIELD_SELECTOR)?.focus();
}

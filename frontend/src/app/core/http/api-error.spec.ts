import { HttpErrorResponse } from '@angular/common/http';

import { toApiError } from './api-error';

describe('toApiError', () => {
  it('lit le détail et les erreurs de champ d’une réponse Problem Details', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { detail: 'Certains champs sont invalides.', errors: { email: 'Adresse e-mail invalide.' } },
    });

    expect(toApiError(error)).toEqual({
      message: 'Certains champs sont invalides.',
      fieldErrors: { email: 'Adresse e-mail invalide.' },
    });
  });

  it('explique que le serveur est injoignable quand le statut vaut 0', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(toApiError(error).message).toContain('injoignable');
  });

  it('renvoie un message générique pour une erreur inconnue', () => {
    expect(toApiError(new Error('boom')).fieldErrors).toEqual({});
  });
});

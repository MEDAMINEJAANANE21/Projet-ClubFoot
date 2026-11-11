import { FormControl, FormGroup } from '@angular/forms';

import { ageRangeValidator, atLeastOneChecked, computeAge, phoneValidator } from './validators';

describe('phoneValidator', () => {
  const validate = (value: string) => phoneValidator()(new FormControl(value));

  it.each(['06 12 34 56 78', '0612345678', '+212 6 12 34 56 78', '+33612345678', '06.12.34.56.78'])(
    'accepte %s',
    (phone) => expect(validate(phone)).toBeNull(),
  );

  it.each(['123', '06 12 34', 'abcdefghij', '+212'])('refuse %s', (phone) => {
    expect(validate(phone)).toEqual({ phone: true });
  });

  it('laisse le champ vide à Validators.required', () => {
    expect(validate('')).toBeNull();
  });
});

describe('ageRangeValidator', () => {
  const today = () => new Date(2026, 5, 15);
  const validate = (birthDate: string) => ageRangeValidator(5, 110, today)(new FormControl(birthDate));

  it('accepte un âge dans l’intervalle', () => {
    expect(validate('2001-05-12')).toBeNull();
  });

  it('refuse un enfant trop jeune', () => {
    expect(validate('2023-01-01')).toEqual({ ageRange: { min: 5, max: 110 } });
  });

  it('refuse une date dans le futur', () => {
    expect(validate('2030-01-01')).not.toBeNull();
  });

  it('compte l’anniversaire seulement quand il est passé', () => {
    expect(computeAge(new Date(2000, 5, 16), today())).toBe(25);
    expect(computeAge(new Date(2000, 5, 15), today())).toBe(26);
  });
});

describe('atLeastOneChecked', () => {
  it('exige au moins une case cochée', () => {
    const group = new FormGroup(
      { a: new FormControl(false), b: new FormControl(false) },
      { validators: atLeastOneChecked() },
    );
    expect(group.errors).toEqual({ atLeastOne: true });

    group.controls.b.setValue(true);
    expect(group.errors).toBeNull();
  });
});

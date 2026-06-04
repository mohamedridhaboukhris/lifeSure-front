import { TestBed } from '@angular/core/testing';

import { TauxAssurance } from './taux-assurance';

describe('TauxAssurance', () => {
  let service: TauxAssurance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauxAssurance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

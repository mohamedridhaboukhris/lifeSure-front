import { TestBed } from '@angular/core/testing';

import { PublicContrat } from './public-contrat';

describe('PublicContrat', () => {
  let service: PublicContrat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicContrat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

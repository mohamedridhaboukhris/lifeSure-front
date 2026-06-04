import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierContrat } from './verifier-contrat';

describe('VerifierContrat', () => {
  let component: VerifierContrat;
  let fixture: ComponentFixture<VerifierContrat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifierContrat],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifierContrat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

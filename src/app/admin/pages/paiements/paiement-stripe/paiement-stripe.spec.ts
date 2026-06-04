import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementStripe } from './paiement-stripe';

describe('PaiementStripe', () => {
  let component: PaiementStripe;
  let fixture: ComponentFixture<PaiementStripe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementStripe],
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementStripe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Taux } from './taux';

describe('Taux', () => {
  let component: Taux;
  let fixture: ComponentFixture<Taux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Taux],
    }).compileComponents();

    fixture = TestBed.createComponent(Taux);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

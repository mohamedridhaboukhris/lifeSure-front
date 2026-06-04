import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteSante } from './carte-sante';

describe('CarteSante', () => {
  let component: CarteSante;
  let fixture: ComponentFixture<CarteSante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteSante],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteSante);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

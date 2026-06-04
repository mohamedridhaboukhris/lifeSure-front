import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteSinistres } from './carte-sinistres';

describe('CarteSinistres', () => {
  let component: CarteSinistres;
  let fixture: ComponentFixture<CarteSinistres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteSinistres],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteSinistres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

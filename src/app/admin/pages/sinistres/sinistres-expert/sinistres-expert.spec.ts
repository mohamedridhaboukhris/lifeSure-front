import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistresExpert } from './sinistres-expert';

describe('SinistresExpert', () => {
  let component: SinistresExpert;
  let fixture: ComponentFixture<SinistresExpert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistresExpert],
    }).compileComponents();

    fixture = TestBed.createComponent(SinistresExpert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

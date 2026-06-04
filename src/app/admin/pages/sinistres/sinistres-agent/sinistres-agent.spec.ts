import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistresAgent } from './sinistres-agent';

describe('SinistresAgent', () => {
  let component: SinistresAgent;
  let fixture: ComponentFixture<SinistresAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistresAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(SinistresAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

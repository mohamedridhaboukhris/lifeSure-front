import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistreForm } from './sinistre-form';

describe('SinistreForm', () => {
  let component: SinistreForm;
  let fixture: ComponentFixture<SinistreForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistreForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SinistreForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

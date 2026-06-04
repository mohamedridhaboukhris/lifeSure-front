import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratForm } from './contrat-form';

describe('ContratForm', () => {
  let component: ContratForm;
  let fixture: ComponentFixture<ContratForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

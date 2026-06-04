import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationsExpert } from './reclamations-expert';

describe('ReclamationsExpert', () => {
  let component: ReclamationsExpert;
  let fixture: ComponentFixture<ReclamationsExpert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationsExpert],
    }).compileComponents();

    fixture = TestBed.createComponent(ReclamationsExpert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

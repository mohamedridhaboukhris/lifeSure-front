import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistreDetail } from './sinistre-detail';

describe('SinistreDetail', () => {
  let component: SinistreDetail;
  let fixture: ComponentFixture<SinistreDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistreDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SinistreDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

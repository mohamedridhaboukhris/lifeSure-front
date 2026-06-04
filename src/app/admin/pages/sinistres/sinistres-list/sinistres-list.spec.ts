import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistresList } from './sinistres-list';

describe('SinistresList', () => {
  let component: SinistresList;
  let fixture: ComponentFixture<SinistresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinistresList],
    }).compileComponents();

    fixture = TestBed.createComponent(SinistresList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import ColourInputComponent from './colour-input.component';

describe('ColourInputComponent', () => {
  let component: ColourInputComponent;
  let fixture: ComponentFixture<ColourInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColourInputComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

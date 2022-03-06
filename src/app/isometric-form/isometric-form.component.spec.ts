import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsometricFormComponent } from './isometric-form.component';

describe('IsometricFormComponent', () => {
  let component: IsometricFormComponent;
  let fixture: ComponentFixture<IsometricFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsometricFormComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsometricFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

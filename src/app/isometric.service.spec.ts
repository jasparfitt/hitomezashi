import { TestBed } from '@angular/core/testing';

import { IsometricService } from './isometric.service';

describe('IsometricService', () => {
  let service: IsometricService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsometricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

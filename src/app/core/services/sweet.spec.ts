import { TestBed } from '@angular/core/testing';

import { Sweet } from './sweet';

describe('Sweet', () => {
  let service: Sweet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sweet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

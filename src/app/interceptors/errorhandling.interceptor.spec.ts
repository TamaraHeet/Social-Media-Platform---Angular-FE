import { TestBed } from '@angular/core/testing';

import { ErrorhandlingInterceptor } from './errorhandling.interceptor';

describe('ErrorhandlingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorhandlingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorhandlingInterceptor = TestBed.inject(ErrorhandlingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

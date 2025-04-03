import { TestBed } from '@angular/core/testing';

import { ShippoApiService } from './shippo-api.service';

describe('ShippoApiService', () => {
  let service: ShippoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

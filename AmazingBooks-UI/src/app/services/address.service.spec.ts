import { TestBed } from '@angular/core/testing';

import { AddressApiService } from './address.service';

describe('ShippoApiService', () => {
  let service: AddressApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

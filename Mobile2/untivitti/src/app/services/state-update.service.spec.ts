import { TestBed } from '@angular/core/testing';

import { StateUpdateService } from './state-update.service';

describe('StateUpdateService', () => {
  let service: StateUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

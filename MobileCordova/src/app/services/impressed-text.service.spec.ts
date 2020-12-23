import { TestBed } from '@angular/core/testing';

import { ImpressedTextService } from './impressed-text.service';

describe('ImpressedTextService', () => {
  let service: ImpressedTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpressedTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

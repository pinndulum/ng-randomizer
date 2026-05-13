import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfig } from '../interfaces/app-config.interface';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppConfig, useValue: new AppConfig({ env: 'development' }) },
        { provide: MatDialog, useValue: { openDialogs: [], open: () => ({ afterClosed: () => undefined }) } },
        { provide: MatSnackBar, useValue: { open: () => undefined } }
      ]
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
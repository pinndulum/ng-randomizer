import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { DialogTemplateComponent } from '../components/controls/dialog-template/dialog-template.component';
import { AppConfig } from '../interfaces/app-config.interface';

import { AlertService, DialogModel } from './alert.service';

interface MatDialogStub {
    openDialogs: MatDialogRef<DialogTemplateComponent, string | undefined>[];
    open: jasmine.Spy;
}

describe('AlertService', () => {
    let service: AlertService;
    let dialog: MatDialogStub;
    let snackbarOpen: jasmine.Spy;

    beforeEach(() => {
        const dialogRef = {
            afterClosed: () => of('done')
        } as MatDialogRef<DialogTemplateComponent, string | undefined>;

        dialog = {
            openDialogs: [],
            open: jasmine.createSpy('open').and.returnValue(dialogRef)
        };
        snackbarOpen = jasmine.createSpy('open');

        TestBed.configureTestingModule({
            providers: [
                { provide: AppConfig, useValue: new AppConfig({ env: 'development' }) },
                { provide: MatDialog, useValue: dialog },
                { provide: MatSnackBar, useValue: { open: snackbarOpen } }
            ]
        });
        service = TestBed.inject(AlertService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('opens dialogs with a default max height', async () => {
        const data: DialogModel = { title: 'Default dialog' };

        const result = await service.showDialog(data, false);
        const config = dialog.open.calls.mostRecent().args[1] as MatDialogConfig<DialogModel>;

        expect(result).toBe('done');
        expect(dialog.open).toHaveBeenCalledWith(DialogTemplateComponent, jasmine.any(Object));
        expect(config.data).toBe(data);
        expect(config.disableClose).toBeFalse();
        expect(config.maxHeight).toBe('70vh');
    });

    it('passes dialog sizing options through to MatDialog', async () => {
        const data: DialogModel = {
            title: 'Sized dialog',
            opts: {
                maxHeight: '82vh',
                maxWidth: 'calc(100vw - 2rem)',
                panelClass: ['source-dialog'],
                width: 'min(900px, calc(100vw - 2rem))'
            }
        };

        await service.showDialog(data);
        const config = dialog.open.calls.mostRecent().args[1] as MatDialogConfig<DialogModel>;

        expect(config.maxHeight).toBe(data.opts?.maxHeight);
        expect(config.maxWidth).toBe(data.opts?.maxWidth);
        expect(config.panelClass).toBe(data.opts?.panelClass);
        expect(config.width).toBe(data.opts?.width);
    });
});

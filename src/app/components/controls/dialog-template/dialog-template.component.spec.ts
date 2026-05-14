import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogModel } from '../../../../assets/dialog.message';

import { DialogTemplateComponent } from './dialog-template.component';

describe('DialogTemplateComponent', () => {
    let component: DialogTemplateComponent;
    let dialogData: DialogModel;
    let dialogRef: jasmine.SpyObj<MatDialogRef<DialogTemplateComponent, string>>;
    let fixture: ComponentFixture<DialogTemplateComponent>;

    beforeEach(async () => {
        dialogData = {
            title: 'Test dialog',
            message: 'Dialog body'
        };
        dialogRef = jasmine.createSpyObj<MatDialogRef<DialogTemplateComponent, string>>('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [DialogTemplateComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
                { provide: MatDialogRef, useFactory: () => dialogRef }
            ]
        })
            .compileComponents();
    });

    const createComponent = (data = dialogData): HTMLElement => {
        dialogData = data;
        fixture = TestBed.createComponent(DialogTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    };

    it('should create', () => {
        createComponent();

        expect(component).toBeTruthy();
    });

    it('renders image dialogs without action buttons when buttons are empty', () => {
        const nativeElement = createComponent({
            title: 'Image dialog',
            opts: {
                buttons: [],
                image: {
                    src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
                    alt: 'Example source'
                }
            }
        });
        const image = nativeElement.querySelector<HTMLImageElement>('.dialog-image');

        expect(image?.getAttribute('src')).toBe('data:image/gif;base64,R0lGODlhAQABAAAAACw=');
        expect(image?.getAttribute('alt')).toBe('Example source');
        expect(nativeElement.querySelector('.mat-mdc-dialog-actions')).toBeNull();
        expect(nativeElement.querySelectorAll('button').length).toBe(1);
    });

    it('closes from the floating close button', () => {
        const nativeElement = createComponent();
        const closeButton = nativeElement.querySelector<HTMLButtonElement>('.dialog-close');

        closeButton?.click();

        expect(dialogRef.close).toHaveBeenCalled();
    });
});

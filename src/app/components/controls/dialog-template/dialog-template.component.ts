import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { DialogModel } from '@assets/dialog.message';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { SafePipe } from '../../../pipes/safe.pipe';

export interface IFrameSource {
    src: string;
    title: string;
}

export interface ButtonAction {
    title: string;
    action?: string;
}

@Component({
    selector: 'app-dialog-template',
    templateUrl: './dialog-template.component.html',
    styleUrls: ['./dialog-template.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, SafePipe]
})
export class DialogTemplateComponent {
    private readonly data = inject<DialogModel>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject<MatDialogRef<DialogTemplateComponent, string>>(MatDialogRef);

    protected title: string;
    protected message?: string;
    protected iframe?: IFrameSource;
    protected buttons: ButtonAction[] = [];

    constructor () {
        const data = this.data;

        this.title = data.title;
        this.message = data.message;
        this.iframe = data.opts?.iframe;
        this.buttons = data.opts?.buttons || [{ title: 'OK' }];
    }

    protected onPress (button: ButtonAction): void {
        const action = button?.action || button.title;
        this.dialogRef.close(action);
    }
}

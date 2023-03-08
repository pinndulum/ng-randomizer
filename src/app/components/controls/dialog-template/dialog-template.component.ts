import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogModel } from 'src/assets/dialog.message';

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
    styleUrls: ['./dialog-template.component.scss']
})
export class DialogTemplateComponent {
    title: string;
    message?: string;
    iframe?: IFrameSource;
    buttons: ButtonAction[] = [];

    constructor (
        @Inject(MAT_DIALOG_DATA) public data: DialogModel,
        public dialogRef: MatDialogRef<DialogTemplateComponent, string>
    ) {
        this.title = data.title;
        this.message = data.message;
        this.iframe = data.opts?.iframe;
        this.buttons = data.opts?.buttons || [{ title: 'OK' }];
    }

    onPress (button: ButtonAction): void {
        const action = button?.action || button.title;
        this.dialogRef.close(action);
    }
}

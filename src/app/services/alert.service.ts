import { Injectable } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { DialogMessage, DialogModel } from 'src/assets/dialog.message';
import { DialogTemplateComponent } from '../components/controls/dialog-template/dialog-template.component';
import { AppConfig } from '../interfaces/app-config.interface';

export interface AlertMessage {
    type: 'log' | 'warn' | 'error' | 'no-log';
    text: string;
    props?: unknown[];
    action?: string;
    config?: MatSnackBarConfig<any>;
}

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor (
        private cfg: AppConfig,
        private dialog: MatDialog,
        private snackbar: MatSnackBar
    ) {
    }

    success = (message: string, log?: boolean, ...props: unknown[]) => {
        log = log ?? this.cfg.env !== 'production';
        const type = log ? 'log' : 'no-log';
        this.showSnack({ type, text: message, props });
    };

    warn = (message: string, ...props: unknown[]) => {
        this.showSnack({ type: 'warn', text: message, props });
    };

    error = (message: string, ...props: unknown[]) => {
        this.showSnack({ type: 'error', text: message, props });
    };

    showSnack = (msg: AlertMessage) => {
        this.snackbar.open(msg.text,
            msg.action ?? 'OK',
            msg.config ?? { duration: 5000 }
        );
        if (msg.type !== 'no-log') {
            // eslint-disable-next-line no-console
            console[msg.type](`alert: ${msg.text}`, ...(msg.props ?? []));
        }
    };

    dialogState = (data: DialogModel): MatDialogState | undefined => {
        const ref = this.findDialog(data);
        return ref?.getState();
    };

    showDialog = async (data: DialogModel, disableClose = true): Promise<string | undefined> => {
        const ref = this.dialog.open(DialogTemplateComponent, {
            data, disableClose
        });
        return await lastValueFrom<string | undefined>(ref.afterClosed());
    };

    dialogMsgState = (key: string): MatDialogState | undefined => {
        const ref = this.findDialogMsg(key);
        return ref?.getState();
    };

    showDialogMsg = async (key: string): Promise<string | undefined> => {
        let result;
        if (DialogMessage[key]) {
            result = await this.showDialog(DialogMessage[key]);
        }
        return result;
    };


    private findDialog = (data: DialogModel) => this.dialog.openDialogs.find(x => x.componentInstance.data === data);
    private findDialogMsg = (key: string) => this.findDialog(DialogMessage[key]);
}

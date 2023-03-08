import { ndx_sig_of } from 'src/app/interfaces/index-signature-of-t.interface';

export class DialogModel {
    public readonly opts?: {
        iframe?: { src: string; title: string };
        buttons?: { title: string; action?: string }[];
    } = {};
    constructor (public title: string, public message?: string) {
    }
}

export const DialogMessage: ndx_sig_of<DialogModel> = {
    reAuth: {
        title: 'Do you want to re-authenticate?',
        opts: {
            buttons: [{
                title: 'Yes', action: 'yes'
            }, {
                title: 'No', action: 'no'
            }]
        }
    }
};

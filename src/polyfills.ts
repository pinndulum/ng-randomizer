// Application imports.
import './app/extensions/array-extensions';
import './app/extensions/date-extensions';
import './app/extensions/number-extensions';
import './app/extensions/object-extensions';
import './app/extensions/string-extensions';
import { ndx_sig_of } from './app/interfaces/index-signature-of-t.interface';

declare global {
    interface Window {
        ATL_JQ_PAGE_PROPS: {
            triggerFunction: (showCollectorDialog: () => void) => void;
            fieldValues?: ndx_sig_of<unknown>;
        };
    }
}

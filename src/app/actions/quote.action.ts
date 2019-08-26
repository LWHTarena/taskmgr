import {Action} from '@ngrx/store';
import {type} from '../utils/type.util';
import {Err, Quote} from '../domain';

export const ActionTypes = {
    QUOTE_LOAD: type('[Quote] Quote'),
    QUOTE_LOAD_SUCCESS: type('[Quote] Quote Success'),
    QUOTE_LOAD_FAIL: type('[Quote] Quote Fail')
};

export class QuoteLoadAction implements Action {
    type = ActionTypes.QUOTE_LOAD;

    constructor(public payload: any = null) {
    }
}

export class QuoteLoadSuccessAction implements Action {
    type = ActionTypes.QUOTE_LOAD_SUCCESS;

    constructor(public payload: Quote) {
    }
}

export class QuoteLoadFailAction implements Action {
    type = ActionTypes.QUOTE_LOAD_FAIL;

    constructor(public payload: string) {
    }
}


export type Actions
    = QuoteLoadAction
    | QuoteLoadSuccessAction
    | QuoteLoadFailAction;

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
// import {tap, map, exhaustMap, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {QuoteService} from '../services';
import * as actions from '../actions/quote.action';


@Injectable()
export class QuoteEffects {
    /**
     *
     */
    @Effect()
    quote$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.QUOTE_LOAD)
        .map((action: actions.QuoteLoadAction) => action.payload)
        .switchMap(() => this.quoteService
            .getQuote()
            .map(quote => new actions.QuoteLoadSuccessAction(quote))
            .catch(err => of(new actions.QuoteLoadFailAction(JSON.stringify(err))))
        );

    /**
     *
     * @param actions$
     * @param authService
     */
    constructor(private actions$: Actions, private quoteService: QuoteService) {
    }
}

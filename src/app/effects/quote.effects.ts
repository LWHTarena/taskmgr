import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {QuoteService} from '../services';
import * as actions from '../actions/quote.action';
import {catchError, map, switchMap} from 'rxjs/operators';


@Injectable()
export class QuoteEffects {
    /**
     *
     */
    @Effect()
    quote$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.QUOTE_LOAD),
      map((action: actions.QuoteLoadAction) => action.payload),
      switchMap(() => this.quoteService.getQuote().pipe(
          map(quote => new actions.QuoteLoadSuccessAction(quote)),
          catchError(err => of(new actions.QuoteLoadFailAction(JSON.stringify(err))))
        )
      )
    );

    constructor(private actions$: Actions, private quoteService: QuoteService) {
    }
}

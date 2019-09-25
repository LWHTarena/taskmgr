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
     * 用 @Effect() 修饰器来标明这是一个 Effect
     */
    @Effect()
    quote$: Observable<Action> = this.actions$.pipe( // action 信号流
      ofType(actions.ActionTypes.QUOTE_LOAD), // 如果是 QUOTE_LOAD
      map((action: actions.QuoteLoadAction) => action.payload), // 转换成 action 的 payload 数据流
      switchMap(() => this.quoteService.getQuote().pipe(
          map(quote => new actions.QuoteLoadSuccessAction(quote)),
          catchError(err => of(new actions.QuoteLoadFailAction(JSON.stringify(err))))
        )
      )
    );

    /**
     * 通过构造注入需要的服务和 action 信号流
     */
    constructor(private actions$: Actions, private quoteService: QuoteService) {
    }
}

import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

import {AuthService} from '../services';
import * as actions from '../actions/auth.action';
import {catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {

  /**
   * 用 @Effect() 修饰器来标明这是一个 Effect
   */
  @Effect()
  login$: Observable<Action> = this.actions$.pipe( //  action 信号流
    ofType(actions.ActionTypes.LOGIN),  //  如果是 LOGIN Action
    map((action: actions.LoginAction) => action.payload), //  转换成 action 的 payload 数据流
    switchMap((val: { email: string, password: string }) => this.authService.login(val.email, val.password).pipe(
      map(auth => new actions.LoginSuccessAction(auth)),
      catchError(err => of(new actions.LoginFailAction({
        status: 501,
        message: err.message,
        exception: err.stack,
        path: '/login',
        timestamp: new Date()
      })))
      )
    )
  );

  /**
   *
   */
  @Effect()
  register$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.REGISTER),
    map((action: actions.RegisterAction) => action.payload),
    switchMap((val) => this.authService.register(val).pipe(
        map(auth => new actions.RegisterSuccessAction(auth)),
        catchError(err => of(new actions.RegisterFailAction(err)))
      )
    )
  );

  @Effect({dispatch: false})
  navigateHome$ /*: Observable<Action>*/ = this.actions$.pipe(
      ofType(actions.ActionTypes.LOGIN_SUCCESS),
      tap(() => this.router.navigate(['/projects']))
    );

  @Effect({dispatch: false})
  registerAndHome /*$: Observable<Action>*/ = this.actions$.pipe(
    ofType(actions.ActionTypes.REGISTER_SUCCESS),
    map(() => this.router.navigate(['/projects']))
  );

  @Effect({dispatch: false})
  logout$ /*: Observable<Action>*/ = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGOUT),
    map(() => this.router.navigate(['/']))
  );

  /**
   * 通过构造注入需要的服务和 action 信号流
   * @param actions$
   * @param authService
   * @param router
   */
  constructor(private actions$: Actions, private authService: AuthService, private router: Router) {
  }
}

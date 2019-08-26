import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
// import {Observable} from 'rxjs/Observable';
// import {of} from 'rxjs/observable/of';

import {AuthService} from '../services';
import * as actions from '../actions/auth.action';

@Injectable()
export class AuthEffects {

    /**
     *
     */
    @Effect()
    login$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOGIN)
        .map((action: actions.LoginAction) => action.payload)
        .switchMap((val: { email: string, password: string }) => this.authService
            .login(val.email, val.password)
            .map(auth => new actions.LoginSuccessAction(auth))
            .catch(err => of(new actions.LoginFailAction({
                status: 501,
                message: err.message,
                exception: err.stack,
                path: '/login',
                timestamp: new Date()
            })))
        );

    /**
     *
     */
    @Effect()
    register$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.REGISTER)
        .map((action: actions.RegisterAction) => action.payload)
        .switchMap((val) => this.authService
            .register(val)
            .map(auth => new actions.RegisterSuccessAction(auth))
            .catch(err => of(new actions.RegisterFailAction(err)))
        );

    @Effect({ dispatch: false })
    navigateHome$ /*: Observable<Action>*/ = this.actions$
        .ofType(actions.ActionTypes.LOGIN_SUCCESS)
        .do(() => this.router.navigate(['/projects']));

    @Effect({ dispatch: false })
    registerAndHome /*$: Observable<Action>*/ = this.actions$
        .ofType(actions.ActionTypes.REGISTER_SUCCESS)
        .map(() => this.router.navigate(['/projects']));

    @Effect({ dispatch: false })
    logout$ /*: Observable<Action>*/ = this.actions$
        .ofType(actions.ActionTypes.LOGOUT)
        .map(() => this.router.navigate(['/']));

    /**
     *
     * @param actions$
     * @param authService
     */
    constructor(private actions$: Actions, private authService: AuthService, private router: Router) {
    }
}

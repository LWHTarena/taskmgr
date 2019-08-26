import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {
    StoreRouterConnectingModule,
    RouterStateSerializer,
} from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {AppComponent} from './app.component';
import {LoginModule} from './login/login.module';
import {ProjectModule} from './project/project.module';
import {TaskModule} from './task/task.module';

import {reducers, metaReducers, CustomRouterStateSerializer} from './reducers';
import {environment} from '../environments/environment';
import {QuoteEffects} from './effects/quote.effects';
import {AuthEffects} from './effects/auth.effects';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SharedModule,
        CoreModule,
        LoginModule,
        ProjectModule,
        TaskModule,

        /**
         * StoreModule.forRoot is imported once in the root module, accepting a reducer
         * function or object map of reducer functions. If passed an object of
         * reducers, combineReducers will be run creating your application
         * meta-reducer. This returns all providers for an @ngrx/store
         * based application.
         */
        StoreModule.forRoot(reducers, {metaReducers}),

        /**
         * @ngrx/router-store keeps router state up-to-date in the store.
         */
        StoreRouterConnectingModule,

        /**
         * Store devtools instrument the store retaining past versions of state
         * and recalculating new states. This enables powerful time-travel
         * debugging.
         *
         * To use the debugger, install the Redux Devtools extension for either
         * Chrome or Firefox
         *
         * See: https://github.com/zalmoxisus/redux-devtools-extension
         */
        !environment.production
            ? StoreDevtoolsModule.instrument({
                maxAge: 25 //  Retains last 25 states
            })
            : [],

        /**
         * EffectsModule.forRoot() is imported once in the root module and
         * sets up the effects class to be initialized immediately when the
         * application starts.
         *
         * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
         */
        EffectsModule.forRoot([]),
    ],
    providers: [
        /**
         * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
         * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
         * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
         */
        {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

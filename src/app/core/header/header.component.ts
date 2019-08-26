import {Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {Observable} from 'rxjs/Observable';
import {Auth} from '../../domain';

import * as actions from '../../actions/auth.action';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

    auth$: Observable<Auth>;
    @Output() toggle = new EventEmitter<void>();
    @Output() toggleDarkTheme = new EventEmitter<boolean>();

    constructor(private store$: Store<fromRoot.State>) {
        this.auth$ = this.store$.select(fromRoot.getAuth);
    }

    ngOnInit() {
    }

    openSidebar() {
        this.toggle.emit();
    }

    onChage(checked: boolean) {
        this.toggleDarkTheme.emit(checked);
    }

    logout() {
        this.store$.dispatch({type: actions.ActionTypes.LOGOUT});
    }

}

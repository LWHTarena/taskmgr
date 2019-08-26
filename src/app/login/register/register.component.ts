import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {extractInfo, getAddrByCode, isValidAddr} from '../../utils/identity.util';
import {isValidDate, toDate} from '../../utils/date.util';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/auth.action';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
    selectedTab = 0;
    form: FormGroup;

    items: string[];
    avatars$: Observable<string[]>;
    private _sub: Subscription;
    private readonly avatarName = 'avatars';

    constructor(private fb: FormBuilder, private store$: Store<fromRoot.State>) {
    }

    ngOnInit() {
        const img = `${this.avatarName}:svg-${(Math.random() * 16).toFixed()}`;
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        this.items = nums.map(d => `avatars:svg-${d}`);

        this.form = this.fb.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
            repeat: ['', Validators.required],
            avatar: [img],
            dateOfBirth: ['1991-12-06'],
            address: ['', Validators.maxLength(80)],
            identity: []
        });

        const id$ = this.form.get('identity').valueChanges
            .debounceTime(300)
            .filter(v => this.form.get('identity').valid);

        this._sub = id$.subscribe(id => {
            const info = extractInfo(id.identityNo);
            if (isValidAddr(info.addrCode)) {
                const addr = getAddrByCode(info.addrCode);
                this.form.patchValue({address: addr});
                this.form.updateValueAndValidity({onlySelf: true, emitEvent: true});
            }
            if (isValidDate(info.dateOfBirth)) {
                const date = info.dateOfBirth;
                this.form.patchValue({dateOfBirth: date});
                this.form.updateValueAndValidity({onlySelf: true, emitEvent: true});
            }
        });
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }

    onSubmit({value, valid}, e: Event) {
        console.log(value, valid);
        e.preventDefault();
        if (!valid) {
            return;
        }
        this.store$.dispatch(
            new actions.RegisterAction(value));
    }

    prevTab() {
        this.selectedTab = 0;
    }

    nextTab() {
        this.selectedTab = 1;
    }

    onTabChange(index) {
        this.selectedTab = index;
    }

}

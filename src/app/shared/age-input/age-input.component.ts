import {ChangeDetectionStrategy, Component, forwardRef, OnInit, OnDestroy, Input} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validators
} from '@angular/forms';

import {
    subYears,
    subMonths,
    subDays,
    isBefore,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    parse,
    format,
    isValid,
    isDate,
    isFuture,
} from 'date-fns';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {toDate, isValidDate} from '../../utils/date.util';

export enum AgeUnit {
    Year = 0,
    Month,
    Day
}

export interface Age {
    age: number;
    unit: AgeUnit;
}

@Component({
    selector: 'app-age-input',
    templateUrl: './age-input.component.html',
    styleUrls: ['./age-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AgeInputComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AgeInputComponent),
            multi: true,
        }
    ],
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

    selectedUnit = AgeUnit.Year;
    form: FormGroup;
    ageUnits = [
        {value: AgeUnit.Year, label: '岁'},
        {value: AgeUnit.Month, label: '月'},
        {value: AgeUnit.Day, label: '天'}
    ];
    dateOfBirth;
    @Input() daysTop = 90;
    @Input() daysBottom = 0;
    @Input() monthsTop = 24;
    @Input() monthsBottom = 1;
    @Input() yearsBottom = 1;
    @Input() yearsTop = 150;
    @Input() debounceTime = 300;
    private subBirth: Subscription;
    private propagateChange = (_: any) => {
    }

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        /*const initDate = this.dateOfBirth ? this.dateOfBirth : toDate(subYears(Date.now(), 30));
        const initAge = this.toAge(initDate);
        this.form = this.fb.group({
            birthday: [initDate, this.validateDate],
            age: this.fb.group({
                ageNum: [initAge.age],
                ageUnit: [initAge.unit]
            }, {validator: this.validateAge('ageNum', 'ageUnit')})
        });*/


        this.form = this.fb.group({
            birthday: ['', this.validateDate],
            age: this.fb.group({
                ageNum: [''],
                ageUnit: ['']
            }, {validator: this.validateAge('ageNum', 'ageUnit')})
        });

        const birthday = this.form.get('birthday');
        const ageNum = this.form.get('age').get('ageNum');
        const ageUnit = this.form.get('age').get('ageUnit');

        const birthday$ = birthday.valueChanges
            .map(d => ({date: d, from: 'birthday'}))
            .debounceTime(this.debounceTime)
            .distinctUntilChanged()
            .filter(date => birthday.valid);

        const ageNum$ = ageNum.valueChanges
            .startWith(ageNum.value)
            .debounceTime(this.debounceTime)
            .distinctUntilChanged();
        const ageUnit$ = ageUnit.valueChanges
            .startWith(ageUnit.value)
            .debounceTime(this.debounceTime)
            .distinctUntilChanged();
        const age$ = Observable
            .combineLatest(ageNum$, ageUnit$, (_num, _unit) => this.toDate({age: _num, unit: _unit}))
            .map(d => ({date: d, from: 'age'}))
            .filter(_ => this.form.get('age').valid);

        const merged$ = Observable
            .merge(birthday$, age$)
            .filter(_ => this.form.valid)
            .debug('[Age-Input][Merged]:');
        this.subBirth = merged$.subscribe(date => {
            const age = this.toAge(date.date);
            if (date.from === 'birthday') {
                if (age.age === ageNum.value && age.unit === ageUnit.value) {
                    return;
                }
                if (age.unit !== ageUnit.value) {
                    ageUnit.patchValue(age.unit, {
                        emitEvent: false,
                        emitModelToViewChange: true,
                        emitViewToModelChange: true
                    });

                    this.selectedUnit = age.unit;
                }

                if (age.age !== ageNum.value) {
                    ageNum.patchValue(age.age, {emitEvent: false});
                }

                this.propagateChange(date.date);

            } else {
                const ageToCompare = this.toAge(this.form.get('birthday').value);
                if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
                    this.form.get('birthday').patchValue(date.date, {emitEvent: false});
                    this.propagateChange(date.date);
                }
            }
        });
    }

    writeValue(obj: any): void {
        if (obj) {
            const date = toDate(obj);
            this.form.get('birthday').patchValue(date, {emitEvent: true});
            const age = this.toAge(obj);
            this.form.get('age').get('ageNum').patchValue(age.age);
            this.form.get('age').get('ageUnit').patchValue(age.unit);
        }
    }

    // 当表单控件值改变时，函数 fn 会被调用
    // 这也是我们把变化 emit 回表单的机制
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // 这里没有使用，用于注册 touched 状态
    public registerOnTouched() {
    }

    ngOnDestroy(): void {
        if (this.subBirth) {
            this.subBirth.unsubscribe();
        }
    }

    // 验证表单，验证结果正确返回 null 否则返回一个验证结果对象
    validate(c: FormControl): { [key: string]: any } {
        const val = c.value;
        if (!val) {
            return null;
        }
        if (isValidDate(val)) {
            return null;
        }
        return {
            ageInvalid: true
        };
    }

    validateDate(c: FormControl): { [key: string]: any } {
        const val = c.value;
        return isValidDate(val) && (differenceInYears(Date.now(), val) < 150) ? null : {
            birthdayInvalid: true
        };
    }

    validateAge(ageNumKey: string, ageUnitKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            const ageNum = group.controls[ageNumKey];
            const ageUnit = group.controls[ageUnitKey];
            let result = false;
            const ageNumVal = ageNum.value;

            switch (ageUnit.value) {
                case AgeUnit.Year: {
                    result = ageNumVal >= this.yearsBottom && ageNumVal <= this.yearsTop
                    break;
                }
                case AgeUnit.Month: {
                    result = ageNumVal >= this.monthsBottom && ageNumVal <= this.monthsTop
                    break;
                }
                case AgeUnit.Day: {
                    result = ageNumVal >= this.daysBottom && ageNumVal <= this.daysTop
                    break;
                }
                default: {
                    result = false;
                    break;
                }
            }
            return result ? null : {
                ageInvalid: true
            };
        };
    }

    private toAge(dateStr: string): Age {
        const date = parse(dateStr);
        const now = new Date();
        if (isBefore(subDays(now, this.daysTop), date)) {
            return {
                age: differenceInDays(now, date),
                unit: AgeUnit.Day
            };
        } else if (isBefore(subMonths(now, this.monthsTop), date)) {
            return {
                age: differenceInMonths(now, date),
                unit: AgeUnit.Month
            };
        } else {
            return {
                age: differenceInYears(now, date),
                unit: AgeUnit.Year
            };
        }
    }

    private toDate(age: Age): string {
        const now = new Date();
        switch (age.unit) {
            case AgeUnit.Year: {
                return toDate(subYears(now, age.age));
            }
            case AgeUnit.Month: {
                return toDate(subMonths(now, age.age));
            }
            case AgeUnit.Day: {
                return toDate(subDays(now, age.age));
            }
            default: {
                return this.dateOfBirth;
            }
        }
    }

}

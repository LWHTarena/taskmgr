import {Component, OnInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProjectComponent implements OnInit {
    form: FormGroup;
    dialogTitle = '';
    coverImages: string[];

    constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<NewProjectComponent>, private fb: FormBuilder) {
        this.coverImages = this.data.thumbnails;
    }

    ngOnInit() {
        if (this.data.project) {
            this.form = this.fb.group({
                name: [this.data.project.name, Validators.compose([Validators.required, Validators.maxLength(20)])],
                desc: [this.data.project.desc, Validators.maxLength(40)],
                coverImg: [this.data.project.coverImg, Validators.required]
            });
            this.dialogTitle = '修改项目：';
        } else {
            this.form = this.fb.group({
                name: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
                desc: ['', Validators.maxLength(40)],
                coverImg: [this.data.img, Validators.required]
            });
            this.dialogTitle = '创建项目：';
        }
    }

    onSubmit({value, valid}, event: Event) {
        event.preventDefault();
        if (!valid) {
            return;
        }
        this.dialogRef.close({name: value.name, desc: value.desc ? value.desc : null, coverImg: value.coverImg});
    }

}

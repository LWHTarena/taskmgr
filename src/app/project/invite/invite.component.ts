import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../domain';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

    members: User[] = [];
    dialogTitle: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<InviteComponent>) { }

    ngOnInit() {
        this.members = [...this.data.members];
        this.dialogTitle = this.data.dialogTitle ? this.data.dialogTitle : '邀请成员';
    }

    onSubmit(ev: Event, {value, valid}) {
        ev.preventDefault();
        if (!valid) {
            return;
        }
        this.dialogRef.close(this.members);
    }

}

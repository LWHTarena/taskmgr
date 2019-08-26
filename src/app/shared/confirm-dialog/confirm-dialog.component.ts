import {Component, OnInit, Inject, ChangeDetectionStrategy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    template: `
       <h2 mat-dialog-title>{{title}}</h2>
       <mat-dialog-content>
           {{content}}
       </mat-dialog-content>

    <mat-dialog-actions>
       <button mat-raised-button type="button" color="primary" (click)="onClick(true)">确定</button>
       <button mat-button mat-dialog-close type="button" (click)="onClick(false)">关闭</button>
    </mat-dialog-actions>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent implements OnInit {

    title = '';
    content = '';

    constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    }

    ngOnInit() {
        this.title = this.data.title;
        this.content = this.data.content;
    }

    onClick(reulst: boolean) {
        this.dialogRef.close(reulst);
    }

}

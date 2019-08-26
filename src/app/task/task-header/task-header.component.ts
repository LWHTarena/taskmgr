import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-task-list-header',
    templateUrl: './task-header.component.html',
    styleUrls: ['./task-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHeaderComponent {

    @Output() changeListName = new EventEmitter<void>();
    @Output() deleteList = new EventEmitter<void>();
    @Output() moveAllTasks = new EventEmitter<void>();
    @Output() newTask = new EventEmitter<void>();
    @Input() header = '';

    constructor() {
    }

    onChangeListName(ev: Event) {
        ev.preventDefault();
        this.changeListName.emit();
    }

    onMoveAllTasks(ev: Event) {
        ev.preventDefault();
        this.moveAllTasks.emit();
    }

    onDeleteList(ev: Event) {
        ev.preventDefault();
        this.deleteList.emit();
    }

    addNewTask(ev: Event) {
        ev.preventDefault();
        this.newTask.emit();
    }

}

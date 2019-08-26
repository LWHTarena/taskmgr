import {
    Component,
    OnInit,
    Input,
    Inject,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    ChangeDetectionStrategy
} from '@angular/core';
import {itemAnim} from '../../anim/item.anim';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [itemAnim]
})
export class TaskItemComponent implements OnInit {

    @Input() item;
    @Input() avatar;
    @Output() taskClick = new EventEmitter<void>();
    widerPriority = 'in';

    constructor() {
    }

    ngOnInit() {
        this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
    }

    onItemClick() {
        this.taskClick.emit();
    }

    onCheckboxClick(event: Event) {
        event.stopPropagation();
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.widerPriority = 'out';
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.widerPriority = 'in';
    }

}

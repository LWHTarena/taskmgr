import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    ChangeDetectionStrategy
} from '@angular/core';
import {cardAnim} from '../../anim/card.anim';

@Component({
    selector: 'app-project-item',
    templateUrl: './project-item.component.html',
    styleUrls: ['./project-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        cardAnim
    ]
})
export class ProjectItemComponent implements OnInit {

    @Input() item;
    @Output() itemSelected = new EventEmitter<void>();
    @Output() onInvite = new EventEmitter<void>();
    @Output() onEdit = new EventEmitter<void>();
    @Output() onDel = new EventEmitter<void>();
    @HostBinding('@card') cardState = 'out';  // 绑定到宿主,app-project-item

    constructor() {
    }

    ngOnInit() {
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.cardState = 'hover';
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.cardState = 'out';
    }

    onInviteClick(ev: Event) {
        ev.preventDefault();
        this.onInvite.emit();
    }

    onEditClick(ev: Event) {
        ev.preventDefault();
        this.onEdit.emit();
    }

    onDeleteClick(ev: Event) {
        ev.preventDefault();
        this.onDel.emit();
    }

    onClick(ev: Event) {
        ev.preventDefault();
        this.itemSelected.emit();
    }

}

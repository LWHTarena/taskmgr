import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DragDirective} from './drag-drop/drag.directive';
import {DropDirective} from './drag-drop/drop.directive';
import {DragDropService} from './drag-drop.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DragDirective,
        DropDirective
    ],
    exports: [
        DragDirective,
        DropDirective
    ],
    providers:[
        DragDropService
    ]
})
export class DirectiveModule {
}

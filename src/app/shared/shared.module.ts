import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatChipsModule,
} from '@angular/material';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {DirectiveModule} from '../directive/directive.module';
import {ImageListSelectComponent} from './image-list-select/image-list-select.component';
import {AgeInputComponent} from './age-input/age-input.component';
import {ChipsListComponent} from './chips-list/chips-list.component';
import {IdentityInputComponent} from './identity-input/identity-input.component';
import {AreaListComponent} from './area-list/area-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatTabsModule,
        MatChipsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectiveModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatListModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatTabsModule,
        MatChipsModule,
        ImageListSelectComponent,
        AgeInputComponent,
        ChipsListComponent,
        IdentityInputComponent,
        AreaListComponent,
    ],
    declarations: [
        ConfirmDialogComponent,
        ImageListSelectComponent,
        AgeInputComponent,
        ChipsListComponent,
        IdentityInputComponent,
        AreaListComponent,
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ]
})
export class SharedModule {
}

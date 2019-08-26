import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectItemComponent} from './project-item/project-item.component';
import {ProjectListComponent} from './project-list/project-list.component';
import {NewProjectComponent} from './new-project/new-project.component';
import {InviteComponent} from './invite/invite.component';


@NgModule({
  imports: [
    SharedModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectItemComponent,
    ProjectListComponent,
    NewProjectComponent,
    InviteComponent,
  ],
  entryComponents: [
    NewProjectComponent,
    InviteComponent,
  ]
})
export class ProjectModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    // {path: '', component: AppComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'projects', redirectTo: '/projects', pathMatch: 'full'},
    {
        path: 'tasklists/:id',
        loadChildren: 'app/task/task.module#TaskModule',
        // canActivate: [AuthGuardService]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ProjectService} from '../services';
import * as actions from '../actions/project.action';
import * as tasklistActions from '../actions/task-list.action';
import * as userActions from '../actions/user.action';
import * as fromRoot from '../reducers';
import {Project} from '../domain';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';


@Injectable()
export class ProjectEffects {

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOADS),
    map((action: actions.LoadProjectsAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getAuth)),
    switchMap(([_, auth]) => this.service.get(auth.user.id).pipe(
      map(projects => new actions.LoadProjectsSuccessAction(projects)),
      catchError(err => of(new actions.LoadProjectsFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  addProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddProjectAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getAuth)),
    switchMap(([project, auth]) => {
        const added = {...project, members: [`${auth.user.id}`]};
        return this.service.add(added).pipe(
          map(returned => new actions.AddProjectSuccessAction(returned)),
          catchError(err => of(new actions.AddProjectFailAction(JSON.stringify(err))))
        );
      }
    )
  );


  @Effect()
  updateProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateProjectAction) => action.payload),
    switchMap(project => this.service.update(project).pipe(
      map(returned => new actions.UpdateProjectSuccessAction(returned)),
      catchError(err => of(new actions.UpdateProjectFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  updateLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE_LISTS),
    map((action: actions.UpdateListsAction) => action.payload),
    switchMap(project => this.service.updateTaskLists(project).pipe(
      map(returned => new actions.UpdateListsSuccessAction(returned)),
      catchError(err => of(new actions.UpdateListsFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect()
  removeProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteProjectAction) => action.payload),
    switchMap(project => this.service.del(project).pipe(
        map(returned => new actions.DeleteProjectSuccessAction(returned)),
        catchError(err => of(new actions.DeleteProjectFailAction(JSON.stringify(err))))
      )
    )
  );

  @Effect({dispatch: false})
  selectProject$ /*: Observable<Action>*/ = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT),
    map((action: actions.SelectProjectAction) => action.payload),
    map(project => this.router.navigate([`/tasklists/${project.id}`]))
  );

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT),
    map((action: actions.SelectProjectAction) => action.payload),
    map(project => new tasklistActions.LoadTaskListsAction(project.id))
  );

  @Effect()
  toLoadUsersByPrj$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT),
    map((action: actions.SelectProjectAction) => action.payload),
    map(project => new userActions.LoadUsersByPrjAction(project.id))
  );

  @Effect()
  startInitTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD_SUCCESS),
    map((action: actions.AddProjectSuccessAction) => action.payload),
    map(project => new tasklistActions.InitTaskListsAction(project))
  );

  @Effect()
  addUserPrjRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD_SUCCESS),
    map((action: actions.AddProjectSuccessAction) => action.payload),
    map((prj: Project) => prj.id),
    withLatestFrom(this.store$.select(fromRoot.getAuth).pipe(map(auth => auth.user)), (projectId, user) => {
      return new userActions.AddUserProjectAction({user: user, projectId: projectId});
    })
  );

  @Effect()
  delUserPrjRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE_SUCCESS),
    map((action: actions.DeleteProjectSuccessAction) => action.payload),
    map((prj: Project) => prj.id),
    withLatestFrom(this.store$.select(fromRoot.getAuth).pipe(map(auth => auth.user)), (projectId, user) => {
      return new userActions.RemoveUserProjectAction({ user: user, projectId: projectId});
    })
  );

  @Effect()
  inviteMembersRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE),
    map((action: actions.InviteMembersAction) => action.payload),
    switchMap(({projectId, members}) =>
      this.service.inviteMembers(projectId, members).pipe(
        map((project: Project) => new actions.InviteMembersSuccessAction(project)),
        catchError(err => of(new actions.InviteMembersFailAction(err)))
      )
    )
  );

  @Effect()
  updateUserPrjRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE_SUCCESS),
    map((action: actions.InviteMembersSuccessAction) => action.payload),
    map((project: Project) => new userActions.BatchUpdateUserProjectAction(project))
  );

  /**
   *
   * @param actions$ action 流
   * @param service  注入 ProjectService
   * @param store$ 注入 redux store
   */
  constructor(private actions$: Actions,
              private service: ProjectService,
              private store$: Store<fromRoot.State>,
              private router: Router) {
  }
}

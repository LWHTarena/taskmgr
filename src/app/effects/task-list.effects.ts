import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {TaskListService} from '../services';
import * as actions from '../actions/task-list.action';
import * as prjActions from '../actions/project.action';
import * as taskActions from '../actions/task.action';
import * as fromRoot from '../reducers';
import {Task, TaskList} from '../domain';
import {from, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

@Injectable()
export class TaskListEffects {
    /**
     *
     */
    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.LOADS),
      map((action: actions.LoadTaskListsAction) => action.payload),
      switchMap((projectId) => this.service$.get(projectId).pipe(
          map(taskLists => new actions.LoadTaskListsSuccessAction(taskLists)),
          catchError(err => of(new actions.LoadTaskListsFailAction(JSON.stringify(err))))
        )
      )
    );

    @Effect()
    addTaskList$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.ADD),
      map((action: actions.AddTaskListAction) => action.payload),
      switchMap((taskList) => {
          return this.service$.add(taskList).pipe(
              map(tl => new actions.AddTaskListSuccessAction(tl)),
              catchError(err => of(new actions.AddTaskListFailAction(JSON.stringify(err))))
            );
        }
      )
    );

    @Effect()
    updateTaskList$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.UPDATE),
      map((action: actions.UpdateTaskListAction) => action.payload),
      switchMap(taskList => this.service$.update(taskList).pipe(
          map(tl => new actions.UpdateTaskListSuccessAction(tl)),
          catchError(err => of(new actions.UpdateTaskListFailAction(JSON.stringify(err))))
        )
      )
    );

    @Effect()
    removeTaskList$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.DELETE),
      map((action: actions.DeleteTaskListAction) => action.payload),
      switchMap(taskList => this.service$.del(taskList).pipe(
          map(tl => new actions.DeleteTaskListSuccessAction(tl)),
          catchError(err => of(new actions.DeleteTaskListFailAction(JSON.stringify(err))))
        )
      )
    );

    @Effect()
    removeTasksInList$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.DELETE_SUCCESS),
      map((action: actions.DeleteTaskListSuccessAction) => action.payload),
      switchMap((taskList: TaskList) => {
        return this.store$.select(fromRoot.getTasks).pipe(
          switchMap((tasks: Task[]) => from(tasks.filter(t => t.taskListId === taskList.id))),
          map(task => new taskActions.DeleteTaskAction(task))
        );
      })
    );

    @Effect()
    initializeTaskLists$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.INITIALIZE),
      map((action: actions.InitTaskListsAction) => action.payload),
      switchMap(prj => {
        return this.service$.initializeTaskLists(prj).pipe(
          map(project => new actions.InitTaskListsSuccessAction(project)),
          catchError(err => of(new actions.InitTaskListsFailAction(JSON.stringify(err))))
        );
      })
    );

    @Effect()
    updateProjectRef$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.INITIALIZE_SUCCESS),
      map((action: actions.InitTaskListsSuccessAction) => action.payload),
      map(prj => new prjActions.UpdateListsAction(prj))
    );

    @Effect()
    swapOrder$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.SWAP_ORDER),
      map((action: actions.SwapOrderAction) => action.payload),
      switchMap(({src, target}) =>
        this.service$.swapOrder(src, target).pipe(
          map(tls => new actions.SwapOrderSuccessAction(tls)),
          catchError(err => of(new actions.SwapOrderFailAction(err)))
        )
      )
    );

    @Effect()
    loadTasksInList$: Observable<Action> = this.actions$.pipe(
      ofType(actions.ActionTypes.LOADS_SUCCESS),
      map((action: actions.LoadTaskListsSuccessAction) => action.payload),
      map(lists => new taskActions.LoadTasksInListsAction(lists))
    );

    /**
     * 任务列表的 Effects
     * @param actions$ 注入 action 数据流
     * @param service 注入任务列表服务
     * @param store$ 注入 redux store
     */
    constructor(private actions$: Actions,
                private service$: TaskListService,
                private store$: Store<fromRoot.State>) {
    }
}

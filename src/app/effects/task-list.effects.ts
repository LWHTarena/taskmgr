import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {TaskListService} from '../services';
import * as actions from '../actions/task-list.action';
import * as prjActions from '../actions/project.action';
import * as taskActions from '../actions/task.action';
import * as fromRoot from '../reducers';
import {Task, TaskList} from '../domain';
import {Observable, of} from 'rxjs';

@Injectable()
export class TaskListEffects {
    /**
     *
     */
    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOADS)
        .map((action: actions.LoadTaskListsAction) => action.payload)
        .switchMap((projectId) => this.service$
            .get(projectId)
            .map(taskLists => new actions.LoadTaskListsSuccessAction(taskLists))
            .catch(err => of(new actions.LoadTaskListsFailAction(JSON.stringify(err))))
        );

    @Effect()
    addTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.ADD)
        .map((action: actions.AddTaskListAction) => action.payload)
        .switchMap((taskList) => {
                return this.service$
                    .add(taskList)
                    .map(tl => new actions.AddTaskListSuccessAction(tl))
                    .catch(err => of(new actions.AddTaskListFailAction(JSON.stringify(err))));
            }
        );

    @Effect()
    updateTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.UPDATE)
        .map((action: actions.UpdateTaskListAction) => action.payload)
        .switchMap(taskList => this.service$
            .update(taskList)
            .map(tl => new actions.UpdateTaskListSuccessAction(tl))
            .catch(err => of(new actions.UpdateTaskListFailAction(JSON.stringify(err))))
        );

    @Effect()
    removeTaskList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE)
        .map((action: actions.DeleteTaskListAction) => action.payload)
        .switchMap(taskList => this.service$
            .del(taskList)
            .map(tl => new actions.DeleteTaskListSuccessAction(tl))
            .catch(err => of(new actions.DeleteTaskListFailAction(JSON.stringify(err))))
        );

    @Effect()
    removeTasksInList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.DELETE_SUCCESS)
        .map((action: actions.DeleteTaskListSuccessAction) => action.payload)
        .switchMap((taskList: TaskList) => {
            return this.store$.select(fromRoot.getTasks)
                .switchMap((tasks: Task[]) =>
                    Observable.from(tasks.filter(t => t.taskListId === taskList.id)))
                .map(task => new taskActions.DeleteTaskAction(task));
        });

    @Effect()
    initializeTaskLists$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.INITIALIZE)
        .map((action: actions.InitTaskListsAction) => action.payload)
        .switchMap(prj => {
            return this.service$.initializeTaskLists(prj)
                .map(project => new actions.InitTaskListsSuccessAction(project))
                .catch(err => of(new actions.InitTaskListsFailAction(JSON.stringify(err))));
        });

    @Effect()
    updateProjectRef$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.INITIALIZE_SUCCESS)
        .map((action: actions.InitTaskListsSuccessAction) => action.payload)
        .map(prj => new prjActions.UpdateListsAction(prj));

    @Effect()
    swapOrder$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.SWAP_ORDER)
        .map((action: actions.SwapOrderAction) => action.payload)
        .switchMap(({src, target}) =>
            this.service$.swapOrder(src, target)
                .map(tls => new actions.SwapOrderSuccessAction(tls))
                .catch(err => of(new actions.SwapOrderFailAction(err)))
        );

    @Effect()
    loadTasksInList$: Observable<Action> = this.actions$
        .ofType(actions.ActionTypes.LOADS_SUCCESS)
        .map((action: actions.LoadTaskListsSuccessAction) => action.payload)
        .map(lists => new taskActions.LoadTasksInListsAction(lists));

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

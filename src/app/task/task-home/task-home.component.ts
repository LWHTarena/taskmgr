import {Component, OnInit, HostBinding, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {NewTaskComponent} from '../new-task/new-task.component';
import {CopyTaskComponent} from '../copy-task/copy-task.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {slideToRight} from '../../anim/router.anim';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as listActions from '../../actions/task-list.action';
import * as taskActions from '../../actions/task.action';
import {Task, TaskList} from '../../domain';
import {TaskListVM} from '../../vm/task-list.vm';
import {Observable, Subscription} from 'rxjs';
import {filter, map, pluck, take, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideToRight]
})
export class TaskHomeComponent implements OnDestroy {

  @HostBinding('@routeAnim') state;
  lists$: Observable<TaskListVM[]>;

  private projectId: string;
  private routeParamSub: Subscription;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private store$: Store<fromRoot.State>) {
    const routeParam$ = this.route.params.pipe(pluck('id'));
    this.routeParamSub = routeParam$.subscribe(
      (id: string) => {
        this.projectId = id;
      });
    this.lists$ = this.store$.select(fromRoot.getTasksByList);
  }

  ngOnDestroy() {
    // 取消订阅以免内存泄露
    if (this.routeParamSub) {
      this.routeParamSub.unsubscribe();
    }
  }

  handleRenameList(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {name: list.name}});
    dialogRef.afterClosed().pipe(take(1), filter(n => n)).subscribe(name => {
      this.store$.dispatch(new listActions.UpdateTaskListAction({...list, name: name}));
    });
  }

  handleNewTaskList(ev: Event) {
    ev.preventDefault();
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {}});
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      withLatestFrom(this.store$.select(fromRoot.getMaxListOrder), (_n, _o) => {
        return {
          name: _n,
          order: _o
        };
      })
    ).subscribe(({name, order}) => {
        this.store$.dispatch(new listActions.AddTaskListAction({
          name: name,
          order: order + 1,
          projectId: this.projectId
        }));
      });
  }

  handleMoveList(listId: string) {
    const list$ = this.store$
      .select(fromRoot.getProjectTaskList)
      .pipe(map(lists => lists.filter(list => list.id !== listId)));
    const dialogRef = this.dialog.open(CopyTaskComponent, {data: {srcListId: listId, lists: list$}});
    dialogRef.afterClosed().pipe(take(1), filter(n => n)).subscribe(val => {
      this.store$.dispatch(new taskActions.MoveAllAction(val));
    });
  }

  handleDelList(list: TaskList) {
    const confirm = {
      title: '删除项目：',
      content: '确认要删除该任务列表？',
      confirmAction: '确认删除'
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {dialog: confirm}});

    // 使用 take(1) 来自动销毁订阅，因为 take(1) 意味着接收到 1 个数据后就完成了
    dialogRef.afterClosed().pipe(take(1)).subscribe(val => {
      if (val) {
        this.store$.dispatch(new listActions.DeleteTaskListAction(list));
      }
    });
  }

  handleCompleteTask(task) {
    this.store$.dispatch(new taskActions.CompleteTaskAction(task));
  }

  handleMove(srcData, taskList: TaskList) {
    switch (srcData.tag) {
      case 'task-item': {
        this.store$.dispatch(new taskActions.MoveTaskAction({
          taskId: srcData.data.id,
          taskListId: taskList.id
        }));
        break;
      }
      case 'task-list': {
        this.store$.dispatch(new listActions.SwapOrderAction({src: srcData.data, target: taskList}));
        break;
      }
      default:
        break;
    }
  }

  handleAddTask(listId: string) {
    const user$ = this.store$.select(fromRoot.getAuthUser);
    user$.pipe(take(1)).subscribe(user => {
      const dialogRef = this.dialog.open(NewTaskComponent, {data: {owner: user}});
      dialogRef.afterClosed().pipe(take(1), filter(n => n))
        .subscribe(val => {
          this.store$.dispatch(new taskActions.AddTaskAction({
            ...val.task,
            taskListId: listId,
            completed: false,
            createDate: new Date()
          }));
        });
    });
  }

  handleUpdateTask(task: Task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {task: task}});
    dialogRef.afterClosed()
      .pipe(take(1), filter(n => n)).subscribe((val) => {
      if (val.type !== 'delete') {
        this.store$.dispatch(new taskActions.UpdateTaskAction({...task, ...val.task}));
      } else {
        this.store$.dispatch(new taskActions.DeleteTaskAction(val.task));
      }
    });
  }

  handleQuickTask(desc: string, listId: string) {
    const user$ = this.store$.select(fromRoot.getAuthUser);
    user$.pipe(take(1)).subscribe(user => {
      this.store$.dispatch(new taskActions.AddTaskAction({
        desc: desc,
        priority: 3,
        remark: null,
        ownerId: user.id,
        participantIds: [],
        taskListId: listId,
        completed: false,
        createDate: new Date()
      }));
    });

  }

}
